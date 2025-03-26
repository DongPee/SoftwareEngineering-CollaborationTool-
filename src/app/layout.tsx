import "./globals.css";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header
          style={{
            padding: "10px",
            background: "#6200ea",
            color: "black",
            textAlign: "center",
            display: "flex",
            justifyContent: "center", // h1을 가운데 정렬
            alignItems: "center", // 세로 가운데 정렬
            position: "relative", // 상대 위치로 설정하여 버튼을 오른쪽으로 이동시킬 수 있음
            borderRadius :20
          }}
        >
          <h1 style={{ margin: 0,
            fontSize:30,
            padding:0,
            color:"white"
          }}>Ollert</h1> 
          
          <Link href="login">
            <button
              className="login"
              style={{
                position: "absolute", 
                right: "10px", // 오른쪽에 배치
                top: "50%", // 세로 가운데 정렬
                transform: "translateY(-50%)", // 정확한 세로 가운데 정렬
              }}
            >
              log in
            </button>
          </Link>
        </header>
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}