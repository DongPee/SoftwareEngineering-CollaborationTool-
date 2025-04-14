// 카드 모달, 댓글 컴포넌트
"use client";
import { useState } from "react";
import { Card } from "./projectBoard";

type CardModalProps = {
  card: Card;
  onSave: (updatedCard: Card) => void;
  onClose: () => void;
};

export default function CardModal({ card, onSave, onClose }: CardModalProps) {
  const [editedDetails, setEditedDetails] = useState(card.details);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(card.comments);

  const handleSave = () => {
    const updatedCard: Card = {
      ...card,
      details: editedDetails,
      comments,
    };
    onSave(updatedCard);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment("");
  };

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{card.text}</h2>

        {/* 상세 정보 */}
        <textarea
          className="w-full border mb-2 p-2"
          value={editedDetails}
          onChange={(e) => setEditedDetails(e.target.value)}
          placeholder="상세 정보를 입력하세요"
        />

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          저장
        </button>

        {/* 댓글 */}
        <h3 className="text-lg mt-4 mb-2">댓글</h3>
        <ul className="mb-2">
          {comments.map((comment, index) => (
            <li key={index} className="border-b py-1">{comment}</li>
          ))}
        </ul>
        <input
          className="w-full border mb-2 p-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글 추가"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          댓글 추가
        </button>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
