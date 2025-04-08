// utils/verification.ts

export const requestVerification = async (email: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("인증 코드 요청 오류:", error);
      return { success: false, error: "인증 코드 요청 중 문제가 발생했습니다." };
    }
  };
  
  export const verifyCode = async (email: string, verificationCode: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode }),
      });
  
      const data = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("인증 오류:", error);
      return { success: false, error: "인증 처리 중 문제가 발생했습니다." };
    }
  };