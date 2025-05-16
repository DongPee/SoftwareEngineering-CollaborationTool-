// components/projectTimeline.tsx
'use client';
import { useEffect, useState, useContext} from 'react';
import type { Card } from "../cardContext";
import CardModal from "./CardModal";
import { CardContext } from '../cardContext';
function ProjectTimeline({
  projectId,
}: {
  projectId: string | null;
}) {
  const [tasks, setTasks] = useState<{id : number, name : string, start : string, end : string}[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const cardCon = useContext(CardContext);
  console.log(cardCon);
  useEffect(() => {
    const dummyTasks = [
      { id: 1, name: '기획안 작성', start: '2025-05-01', end: '2025-05-05' },
      {
        id: 2,
        name: '디자인 시안 제작',
        start: '2025-05-06',
        end: '2025-05-10',
      },
      { id: 3, name: '프론트 개발', start: '2025-05-11', end: '2025-05-20' },
    ];
    setTasks(dummyTasks);
  }, [projectId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📅 타임라인</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">업무</th>
              <th className="border border-gray-300 px-4 py-2">시작일</th>
              <th className="border border-gray-300 px-4 py-2">종료일</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {task.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.start}
                </td>
                <td className="border border-gray-300 px-4 py-2">{task.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCard && (
        <CardModal
          card={selectedCard}
          setSelectedCard={setSelectedCard}
          projectId={projectId}
        />
      )}
    </div>
  );
}

export default ProjectTimeline;