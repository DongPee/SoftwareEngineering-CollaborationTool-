"use client";
import { useState, useEffect } from "react";
import { Card } from "./projectBoard";
import styles from "./CardModal.module.css";

type CardModalProps = {
  card: Card;
  onSave: (updatedCard: Card) => void;
  onClose: () => void;
  assigneeOptions?: string[];
};

export default function CardModal({
  card,
  onSave,
  onClose,
  assigneeOptions = ["user1", "user2", "user3"],
}: CardModalProps) {
  const [editedDetails, setEditedDetails] = useState(card.details);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<string[]>(card.comments);
  const [assignee, setAssignee] = useState(card.assignee || "");
  const [startDate, setStartDate] = useState(card.startDate || "");
  const [dueDate, setDueDate] = useState(card.dueDate || "");

  useEffect(() => {
    setEditedDetails(card.details);
    setComments(card.comments);
    setAssignee(card.assignee || "");
    setStartDate(card.startDate || "");
    setDueDate(card.dueDate || "");
  }, [card]);

  const handleSave = () => {
    const updatedCard: Card = {
      ...card,
      details: editedDetails,
      comments,
      assignee,
      startDate,
      dueDate,
    };
    onSave(updatedCard);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment("");
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{card.text}</h2>

        <label className={styles.label}>상세 정보</label>
        <textarea
          className={styles.textarea}
          value={editedDetails}
          onChange={(e) => setEditedDetails(e.target.value)}
          placeholder="상세 정보를 입력하세요"
          rows={3}
        />

        <label className={styles.label}>담당자</label>
        <select
          className={styles.select}
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">할당되지 않음</option>
          {assigneeOptions.map((name) => (
            <option key={name} value={name}>{name}</option>
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
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={handleSave} className={styles.button}>저장</button>

        <h3 className={styles.label}>댓글</h3>
        <ul className={styles.commentList}>
          {comments.map((comment, index) => (
            <li key={index} className={styles.commentItem}>{comment}</li>
          ))}
        </ul>

        <div className={styles.commentInputWrap}>
          <input
            className={`${styles.input} ${styles.commentInput}`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글 추가"
          />
          <button onClick={handleAddComment} className={styles.addCommentBtn}>추가</button>
        </div>

        <button onClick={onClose} className={`${styles.button} ${styles.closeBtn}`}>닫기</button>
      </div>
    </div>
  );
}
