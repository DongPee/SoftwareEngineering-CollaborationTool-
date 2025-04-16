import { useState } from "react";
import styles from "./CardModal.module.css";
import type { Card } from "./projectBoard";

type CardModalProps = {
  card: Card;
  onSave: (card: Card) => void;
  onClose: () => void;
  assigneeOptions: string[];
};

export default function CardModal({
  card,
  onSave,
  onClose,
  assigneeOptions,
}: CardModalProps) {
  const [details, setDetails] = useState(card.details);
  const [assignee, setAssignee] = useState(card.assignee || "");
  const [startDate, setStartDate] = useState(card.startDate || "");
  const [endDate, setEndDate] = useState(card.endDate || "");
  const [comments, setComments] = useState<string[]>(card.comments);
  const [newComment, setNewComment] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleSave = () => {
    const updatedCard: Card = {
      ...card,
      details,
      assignee,
      startDate,
      endDate,
      comments,
    };
    onSave(updatedCard);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [...prevComments, newComment.trim()]);
      setNewComment("");
    }
  };

  const handleDeleteComment = (index: number) => {
    setComments((prevComments) => prevComments.filter((_, i) => i !== index));
  };

  const handleEditComment = (index: number) => {
    setEditingIndex(index);
    setEditingText(comments[index]);
  };

  const handleSaveEditedComment = () => {
    if (editingIndex !== null && editingText.trim()) {
      const updated = [...comments];
      updated[editingIndex] = editingText.trim();
      setComments(updated);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
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
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">선택 안 함</option>
          {assigneeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
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
              {comments.map((comment, index) => (
                <div key={index} className={styles.commentItem}>
                  {editingIndex === index ? (
                    <div className={styles.commentInputWrap}>
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className={`${styles.input} ${styles.commentInput}`}
                      />
                      <button
                        onClick={handleSaveEditedComment}
                        className={styles.addCommentBtn}
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <div className={styles.commentInputWrap}>
                      <span style={{ flexGrow: 1 }}>{comment}</span>
                      <button
                        onClick={() => handleEditComment(index)}
                        className={styles.addCommentBtn}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(index)}
                        className={`${styles.addCommentBtn} ${styles.closeBtn}`}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
          확인
        </button>
      </div>
    </div>
  );
}
