'use client';

import { useState, useEffect, useContext, useRef } from "react";
import styles from "./CardModal.module.css";
import { showUsers } from "./addDeleteBoardCard";
import { AuthContext } from "../AuthContext";
import { io } from 'socket.io-client';
import type { CardModalProps, comment} from "../cardContext";
import { writeLog } from "../verification";
import LoginPage from "../login/page";
const socket = io('http://43.203.124.34:5001');

export default function CardModal({ card, setSelectedCard, projectId }: CardModalProps) {
  const [details, setDetails] = useState(card.details);
  const [assignee, setAssignee] = useState<{ assignee: string; id: number }>();
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState(card.startDate || "");
  const [endDate, setEndDate] = useState(card.endDate || "");
  const [comments, setComments] = useState<comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assigneeOptions, setAssigneeOptions] = useState<{ assignee: string; id: number }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editCardTitleToggle, setEditCardTitleToggle] = useState<boolean>(false);
  const [newCardName, setNewCardName] = useState(card.text); // 새 프로젝트 이름
  const auth = useContext(AuthContext);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const email = auth.email || null;
  const uploadFileToS3 = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://43.203.124.34:5001/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("파일 업로드 실패");

    const data = await response.json();
    return data.fileUrl; // S3에 업로드된 파일 URL 반환
  } catch (err) {
    console.error("파일 업로드 중 오류:", err);
    return null;
  }
};

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
      writeLog("카드 저장", `카드 id : ${card.id} 카드 이름 : ${card.text} 담당자 : ${assignee.id ?? null} 카드 상세 설명 : ${card.details} 시작일 : ${startDate || null} 마감일 : ${endDate || null}`, email, projectId.toString());

      socket.emit("isModalChanged");
      setSelectedCard(null);
    } catch (error) {
      console.error("카드 저장 중 오류:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleAddComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed && !selectedFile) return;

    const author = localStorage.getItem("email") || auth?.email;
    if (!author) return;

    let uploadedFileUrl = null;
    if (selectedFile) {
      uploadedFileUrl = await uploadFileToS3(selectedFile);
    }
    console.log(uploadedFileUrl);
    try {
      const response = await fetch("http://43.203.124.34:5001/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card.id,
          content: trimmed,
          email: author,
          fileUrl: uploadedFileUrl,
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
            file_Url: uploadedFileUrl, // ← 프론트에서도 표시
          },
        ]);
        writeLog("댓글추가", `댓글 id(${data.id}) 추가 내용 : ${trimmed}`, email, projectId.toString());

        setNewComment("");
        setSelectedFile(null); // 파일 초기화
        
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

  const handleSaveEditedComment = async (index: number) => {
    const commentId = comments[index].id;
    const trimmed = editingText.trim();
    if (!trimmed) return;

    try {
      const response = await fetch("http://43.203.124.34:5001/api/editComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, content: trimmed, cardId : card.id}),
      });

      if (response.ok) {
        setComments(prev =>
          prev.map((comment, i) =>
            i === index ? { ...comment, text: trimmed } : comment
          )
        );
        setEditingIndex(null);
        setEditingText("");
        writeLog("댓글변경", `댓글 id(${commentId}) 내용을 ${trimmed}로 변경`, email, projectId.toString());

        socket.emit("isModalChanged");
      } else {
        console.error("댓글 수정 실패:", await response.text());
      }
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
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
  const editCardTitle = async () => {
    if (newCardName.trim() === "") return; 
    const name = newCardName.trim();
    try {
      const response = await fetch("http://43.203.124.34:5001/api/editCardTitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, card_id : card.id }),
      });
      if (response.ok) {
        socket.emit("isChanged");
        setEditCardTitleToggle(false);
      }
    } catch (error) {
      console.error("카드 이름 변경 오류:", error);
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
  if(!auth.email) return <LoginPage />
  return (
    <div className={styles.modal} onClick={() => setSelectedCard(null)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className="flex">
          <h2 className={styles.title}>{newCardName}</h2>
          {!editCardTitleToggle ? (
            <p 
              className={styles.title2}
              onClick={() => setEditCardTitleToggle(prev => !prev)}
            >✏️수정</p>
          ) : (
            <input
              type="text"
              placeholder="새 이름 입력 후 Enter"
              value={newCardName}
              onChange={e => setNewCardName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editCardTitle();
                }
              }}
              className="border border-gray-300 rounded-md ml-8 px-4 py-2 w-full max-w-40 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          
        </div>
        

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
                          {comment.file_Url && (
                            <a href={comment.file_Url} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
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