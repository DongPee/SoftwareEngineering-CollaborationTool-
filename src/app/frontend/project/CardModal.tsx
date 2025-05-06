import { useState, useEffect, useContext, useRef} from "react";
import styles from "./CardModal.module.css";
import type { Card } from "./projectBoard";
import { showUsers } from "./addDeleteBoardCard";
import { AuthContext } from "../AuthContext";
import { io } from 'socket.io-client';
const socket = io('http://localhost:5001');
type CardModalProps = {
  card: Card;
  onSave: (card: Card) => void;
  onClose: () => void;
  projectId: string | null;
};

export default function CardModal({
  card,
  onSave,
  onClose,
  projectId,
}: CardModalProps) {
  const [details, setDetails] = useState(card.details);
  const [assignee, setAssignee] = useState<{ assignee : string; id : number; }>();
  const [startDate, setStartDate] = useState(card.startDate || "");
  const [endDate, setEndDate] = useState(card.endDate || "");
  const [comments, setComments] = useState<{ text: string; author: string; author_email : string; id : number}[]>([]); // 댓글 내용과 작성자 정보를 관리
  const [newComment, setNewComment] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [assigneeOptions, setAssigneeOptions] = useState<{ assignee : string; id : number; }[]>([]);
  const auth = useContext(AuthContext);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/setCardManager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: card.id,
          assignee: assignee !== undefined ? assignee.id : null,
        }),
      });

      if (!response.ok) {
        throw new Error("날짜 설정 실패");
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
    
    try {
      const response = await fetch("http://localhost:5001/api/setCard_desc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: card.id,
          card_desc : details,
        }),
      });

      if (!response.ok) {
        throw new Error("날짜 설정 실패");
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
    if (!card.id) {
      console.error("날짜 또는 card.id가 없음");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/setStartEndDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: card.id,
          startDate: startDate === "" ? null : startDate,
          endDate: endDate === "" ? null : endDate,
        })
      });

      if (!response.ok) {
        throw new Error("날짜 설정 실패");
      }
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  
    const updatedCard: Card = {
      ...card,
      details,
      startDate,
      endDate,
    };
    onSave(updatedCard);
    socket.emit('isModalChanged');
    onClose();
  };
  const fetchUsernames = async (isMounted : boolean) => {
    const options = await showUsers(projectId);
    const userList = options.map((user: { username: string, id: number}) => ({assignee : user.username, id : user.id}));
    if(isMounted){setAssigneeOptions(userList);}
  };
  const fetchCardManagerStartEndDate = async (isMounted : boolean) =>{
    try {
      const response = await fetch("http://localhost:5001/api/getDescCardManagerStartEndDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: card.id,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if(isMounted){
          setDetails(data.card_desc ?? "");
          setAssignee({assignee : data.username, id : data.manager});
          setStartDate(data.startDate ? data.startDate.slice(0, 10) : "");
          setEndDate(data.endDate ? data.endDate.slice(0, 10) : "");
        }
      } else {
        console.error("댓글 불러오기 실패");
      }
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    }
  };
  const fetchComments = async (isMounted : boolean) => {
    try {
      const response = await fetch("http://localhost:5001/api/getComments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId : card.id,
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json(); 
        if(isMounted){setComments(data);}
      } else {
        console.error("댓글 불러오기 실패");
      }
    } catch (error) {
      console.error("댓글 불러오기 오류:", error);
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (!card?.id) return;
    fetchCardManagerStartEndDate(isMounted);
    fetchUsernames(isMounted);
    fetchComments(isMounted);
    return () => {
      isMounted = false;
    };
  }, [card.id]);
  useEffect(() => {
    let isMounted = true;
    const handleModalChange = () => {
      if (!card?.id) return;
      fetchCardManagerStartEndDate(isMounted);
      fetchUsernames(isMounted);
      fetchComments(isMounted);
    };
    socket.on('isModalChanged', handleModalChange);
    return () => {
      isMounted = false;
      socket.off('isModalChanged', handleModalChange);
    };
  }, []);
  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);
  const handleAddComment = async () => {
    if (newComment.trim()) {
      const author = localStorage.getItem("email") || auth?.email;
      if (!author) {
        console.error("작성자 이메일이 없습니다.");
        return;
      }
      try {
        const response = await fetch("http://localhost:5001/api/addComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardId: card.id,
            content: newComment.trim(),
            email : author,
          }),
        });

        if (!response.ok) {
          throw new Error("댓글 추가 실패");
        }

        const data = await response.json(); 
        const newCommentData = {
          text: newComment.trim(),
          author: data.author,
          author_email:data.author_email,
          id : data.id,
        };

        console.log("댓글 추가 성공:", data);

        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment(""); 
        socket.emit('isModalChanged');
      } catch (error) {
        console.error("댓글 추가 오류:", error);
      }
    }
  };

  const handleDeleteComment = async (index: number) => {
    const commentId = comments[index].id;
    if (commentId) {
      try {
        const response = await fetch("http://localhost:5001/api/deleteComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId }),
        });
        const data = await response.json();
        if (response.ok) {
          setComments((prevComments) => prevComments.filter((_, i) => i !== index));
          socket.emit('isModalChanged');
        } else {
          console.error("댓글 삭제 실패:", data.error);
        }
      } catch (err) {
        console.error("서버 오류 발생:", err);
      }
    }
  };

  const handleEditComment = (index: number) => {
    setEditingIndex(index);
    setEditingText(comments[index].text);
  };

  const handleSaveEditedComment = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updated = [...comments];
      updated[editingIndex].text = editingText.trim();
      setComments(updated);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{card.text}</h2>

        <label className={styles.label}>상세 설명</label>
        <textarea
          className={styles.textarea}
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <label className={styles.label}>담당자</label>
        <select
          className={styles.select}
          value={assignee?.id ?? ""}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedUser = assigneeOptions.find(user => user.id === selectedId);
            setAssignee(selectedUser);
          }}
          >
          <option value="">선택 안 함</option>
          {assigneeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.assignee}
            </option>
          ))}
        </select>
        
        <label className={styles.label}>시작일</label>
        <input
          type="date"
          className={styles.input}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className={styles.label}>마감일</label>
        <input
          type="date"
          className={styles.input}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

          {comments.length > 0 && (
          <>
            <label className={styles.label}>댓글</label>
            <div className={styles.commentList}>
            {comments.map((comment, index) => {
              const currentUser = localStorage.getItem("email") || auth?.email;
              const isAuthor = comment.author_email === currentUser;
              return (
                <div key={index} className={styles.commentItem}>
                  {editingIndex === index ? (
                    <div className={styles.commentInputWrap}>
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className={`${styles.input} ${styles.commentInput}`}
                      />
                      <button onClick={handleSaveEditedComment} className={styles.addCommentBtn}>
                        저장
                      </button>
                    </div>
                  ) : (
                    <div className={styles.commentInputWrap}>
                      <span style={{ flexGrow: 1 }}>
                        {comment.text} - <strong>{comment.author}</strong>
                      </span>

                      {isAuthor && (
                        <>
                          <button onClick={() => handleEditComment(index)} className={styles.addCommentBtn}>
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(index)}
                            className={`${styles.addCommentBtn} ${styles.closeBtn}`}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
            </div>
          </>
        )}

        <div className={styles.commentInputWrap}>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글 입력"
            className={`${styles.input} ${styles.commentInput}`}
          />
          <button onClick={handleAddComment} className={styles.addCommentBtn}>
            추가
          </button>
        </div>

        <button onClick={handleSave} className={styles.button}>
          완료
        </button>
      </div>
    </div>
  );
}
