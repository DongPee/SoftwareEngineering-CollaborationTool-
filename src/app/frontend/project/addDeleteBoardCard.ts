export async function createColumn(title: string, projectId: number) {
  const response = await fetch("http://localhost:5001/api/createColumn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, projectId }),
  });

  const data = await response.json();
  if (response.ok) {
    return {
      id: data.project.columnId, 
      title: title,
    };
  } else {
    console.error("컬럼 생성 실패:", data.error);
    return null;
  }
}
  
  
export const deleteColumn = async (columnId: number) => {
  try {
    const res = await fetch("http://localhost:5001/api/deleteColumn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  } catch (err) {
    console.error("컬럼 삭제 실패:", err);
    throw err;
  }
};
  
  
export async function createCard(title: string, columnId: number) {
  const response = await fetch("http://localhost:5001/api/createCard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, columnId }),
  });

  const data = await response.json();

  if (response.ok) {
    return {
      id: data.result.insertId,  // 백에서 insertId를 주는지 확인!
      text: title,
      details: "",
      comments: [],
    };
  } else {
    console.error("카드 추가 실패:", data.error);
    return null;
  }
}
  
export const deleteCards = async (columnId: number) => {
  try {
    const res = await fetch("http://localhost:5001/api/deleteCards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  } catch (err) {
    console.error("카드 전체 삭제 실패:", err);
    throw err;
  }
};




export const deleteCard = async (columnId: number, cardId:number) => {
  try {
    const res = await fetch("http://localhost:5001/api/deleteCard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId, cardId}),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  } catch (err) {
    console.error("카드 삭제 실패:", err);
    throw err;
  }
};



export const handleInvite = async (projectId : string, inviterEmail : string) => {
  try {
    const response = await fetch("http://localhost:5001/api/createInviteLink", {
      method: "POST",
      body: JSON.stringify({ projectId, inviterEmail }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    await navigator.clipboard.writeText(data.inviteUrl);
    console.log(data.inviteUrl);
    alert("초대 링크가 복사되었습니다!");
  } catch (err) {
    console.error("카드 삭제 실패:", err);
    throw err;
  }
};