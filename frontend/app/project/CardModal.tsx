'use client';

import { useState, useEffect, useContext, useRef } from "react";
import styles from "./CardModal.module.css";
import { showUsers } from "./addDeleteBoardCard";
import { AuthContext } from "../AuthContext";
import { io } from 'socket.io-client';
import type { CardModalProps, Card } from "../cardContext";

const socket = io('http://43.203.124.34:5001');

export default function CardModal({ card, setSelectedAction, projectId }: CardModalProps) {
  const [details, setDetails] = useState(card.details);
  const [assignee, setAssignee] = useState<{ assignee: string; id: number }>();
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState(card.startDate || "");
  const [endDate, setEndDate] = useState(card.endDate || "");
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assigneeOptions, setAssigneeOptions] = useState<{ assignee: string; id: number }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const auth = useContext(AuthContext);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSave = async () => {
    try {
      await fetch("http://43.203.124.34:5001/api/setCardManager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, assignee: assignee?.id ?? null }),
      });

      await fetch("http://43.203.124.34:5001/api/setCard_desc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, card_desc: details }),
      });

      await fetch("http://43.203.124.34:5001/api/setStartEndDate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id, startDate: startDate || null, endDate: endDate || null }),
      });

      socket.emit("isModalChanged");
      setSelectedAction(null);
    } catch (error) {
      console.error("카드 저장 중 오류:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleAddComment = async () => {
  const trimmed = newComment.trim();
  if (!trimmed) return;

  const author = localStorage.getItem("email") || auth?.email;
  if (!author) return;

  try {
    const response = await fetch("http://43.203.124.34:5001/api/addComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId: card.id,
        content: trimmed,
        email: author,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setComments((prev) => [
        ...prev,
        {
          text: trimmed,
          author: data.author,
          author_email: data.author_email,
          id: data.id,
        },
      ]);
      setNewComment("");
      socket.emit("isModalChanged");
    } else {
      console.error("서버 응답 실패", await response.text());
    }
  } catch (error) {
    console.error("댓글 추가 오류:", error);
  }
};

  const handleEditComment = (index: number) => {
    setEditingIndex(index);
    setEditingText(comments[index].text);
  };

  const handleSaveEditedComment = (index: number) => {
  console.log("댓글 수정 기능은 아직 구현되지 않았습니다. index:", index);
};

  const handleDeleteComment = async (index: number) => {
    const commentId = comments[index].id;
    try {
      const response = await fetch("http://43.203.124.34:5001/api/deleteComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (response.ok) {
        setComments((prev) => prev.filter((_, i) => i !== index));
        socket.emit("isModalChanged");
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  const fetchUsernames = async () => {
    const options = await showUsers(projectId);
    const userList = options.map((user: { username: string; id: number }) => ({
      assignee: user.username,
      id: user.id,
    }));
    setAssigneeOptions(userList);
  };

  const fetchCardDetails = async () => {
    try {
      const response = await fetch("http://43.203.124.34:5001/api/getDescCardManagerStartEndDate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setDetails(data.card_desc ?? "");
        setAssignee({ assignee: data.username, id: data.manager });
        setStartDate(data.startDate ? data.startDate.slice(0, 10) : "");
        setEndDate(data.endDate ? data.endDate.slice(0, 10) : "");
      }
    } catch (error) {
      console.error("카드 정보 불러오기 오류:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch("http://43.203.124.34:5001/api/getComments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: card.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    if (!card?.id) return;
    fetchCardDetails();
    fetchUsernames();
    fetchComments();
  }, [card.id]);

  useEffect(() => {
    const handleModalChange = () => {
      if (!card?.id) return;
      fetchCardDetails();
      fetchUsernames();
      fetchComments();
    };
    socket.on("isModalChanged", handleModalChange);
    return () => {
      socket.off("isModalChanged", handleModalChange);
    };
  }, [card?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  return (
    <div className={styles.modal} onClick={() => setSelectedAction(null)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{card.text}</h2>

        <label className={styles.label}>상세 설명</label>
        <textarea className={styles.textarea} rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />

        <div className={styles.selectRow}>
          <div className={styles.selectColumn}>
            <label className={styles.label}>담당자</label>
            <select className={styles.select} value={assignee?.id ?? ""} onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedUser = assigneeOptions.find(user => user.id === selectedId);
              setAssignee(selectedUser);
            }}>
              <option value="">선택 안 함</option>
              {assigneeOptions.map(option => (
                <option key={option.id} value={option.id}>{option.assignee}</option>
              ))}
            </select>
          </div>

          <div className={styles.selectColumn}>
            <label className={styles.label}>중요도</label>
            <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">선택 안 함</option>
              <option value="중요">중요</option>
              <option value="보통">보통</option>
              <option value="낮음">낮음</option>
            </select>
          </div>
        </div>

        <div className={styles.dateRow}>
          <div className={styles.dateColumn}>
            <label className={styles.label}>시작일</label>
            <input type="date" className={styles.input} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className={styles.dateColumn}>
            <label className={styles.label}>마감일</label>
            <input type="date" className={styles.input} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {comments.length > 0 && (
          <>
            <label className={styles.label}>댓글</label>
            <div className={styles.commentList}>
              {comments.map((comment, index) => {
                const currentUser = localStorage.getItem("email") || auth?.email;
                const isAuthor = comment.author_email === currentUser;
                const isEditing = editingIndex === index;
                return (
                  <div key={index} className={styles.commentItem}>
                    <div className={styles.commentInputWrap}>
                      {isEditing ? (
                        <>
                          <input value={editingText} onChange={(e) => setEditingText(e.target.value)} className={`${styles.input} ${styles.commentInput}`} />
                          <button onClick={() => handleSaveEditedComment(index)} className={styles.addCommentBtn}>저장</button>
                        </>
                      ) : (
                        <span style={{ flexGrow: 1 }}>
                          {comment.text} - <strong>{comment.author}</strong>
                          {comment.fileUrl && (
                            <a href={comment.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                              첨부
                            </a>
                          )}
                        </span>
                      )}
                      {isAuthor && !isEditing && (
                        <>
                          <button onClick={() => handleEditComment(index)} className={styles.addCommentBtn}>수정</button>
                          <button onClick={() => handleDeleteComment(index)} className={`${styles.addCommentBtn} ${styles.closeBtn}`}>삭제</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </>
        )}

        <div className={styles.commentInputWrap}>
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글 입력" className={`${styles.input} ${styles.commentInput}`} />
          <label className={styles.fileUploadBtn}>
            첨부
            <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
          </label>
          {selectedFile && <span className={styles.fileName}>{selectedFile.name}</span>}
          <button onClick={handleAddComment} className={styles.addCommentBtn}>추가</button>
        </div>

        <button onClick={handleSave} className={styles.button}>완료</button>
      </div>
    </div>
  );
}
