import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
interface KakaoProfile {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile: {
      nickname: string;
      is_default_nickname: boolean;
    };
    has_email: boolean;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
  };
}
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: {
          scope: "profile_nickname account_email", // ← 이메일 받기 위해 꼭 포함!
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "kakao") {
        const kakaoProfile = profile as KakaoProfile;
        token.name = kakaoProfile?.properties?.nickname ?? "카카오 사용자";
  
        // 디버깅용: rawProfile 저장
        token.rawProfile = kakaoProfile;
      } else if (profile) {
        token.name = profile.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
  
        // 디버깅용: rawProfile 콘솔에 찍기
        console.log("🔥 session 내부의 rawProfile:", token.rawProfile);
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };