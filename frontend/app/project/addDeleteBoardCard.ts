export async function createColumn(title: string, projectId: number) {
  const response = await fetch("http://43.203.124.34:5001/api/createColumn", {
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
    const res = await fetch("http://43.203.124.34:5001/api/deleteColumn", {
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
  const response = await fetch("http://43.203.124.34:5001/api/createCard", {
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
    const res = await fetch("http://43.203.124.34:5001/api/deleteCards", {
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
    const res = await fetch("http://43.203.124.34:5001/api/deleteCard", {
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



export const handleInvite = async (projectId: string, inviterEmail: string) => {
  try {
    const response = await fetch("http://43.203.124.34:5001/api/createInviteLink", {
      method: "POST",
      body: JSON.stringify({ projectId, inviterEmail }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    const link = data.inviteUrl;

    // 클립보드 복사 시도
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        fallbackCopyTextToClipboard(link); // 폴백 함수 호출
      }
      alert("초대 링크가 복사되었습니다!");
    } catch (clipboardError) {
      console.log(clipboardError);
      fallbackCopyTextToClipboard(link);
    }

    console.log(link);
  } catch (err) {
    console.error("초대 링크 복사 실패:", err);
    throw err;
  }
};

// 폴백 함수 정의
function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-1000px";
  textArea.style.left = "-1000px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (!successful) {
      alert("복사에 실패했습니다. 아래 링크를 직접 복사해주세요:\n" + text);
    }
  } catch (err) {
    console.log(err);
    alert("복사 중 오류가 발생했습니다. 아래 링크를 직접 복사해주세요:\n" + text);
  }

  document.body.removeChild(textArea);
}

export const showUsers = async (projectId: string | null) => {
  if (!projectId) return [];

  try {
    const response = await fetch("http://43.203.124.34:5001/api/showProjectUsername", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    const res = await response.json();
    const result = res.rows;

    if (response.ok && Array.isArray(result)) {
      return result; 
    } else {
      console.error("응답 실패:", res.error || "알 수 없는 오류");
      return [];
    }
  } catch (error) {
    console.error("API 호출 실패:", error);
    return [];
  }
};


export const showUsersRole = async (projectId: string | null) => {
  if (!projectId) return [];

  try {
    const response = await fetch("http://43.203.124.34:5001/api/showProjectUsernameRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    const res = await response.json();
    const result = res.rows;

    if (response.ok && Array.isArray(result)) {
      return result; 
    } else {
      console.error("응답 실패:", res.error || "알 수 없는 오류");
      return [];
    }
  } catch (error) {
    console.error("API 호출 실패:", error);
    return [];
  }
};