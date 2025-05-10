# 1. Node.js 이미지 기반
FROM node:18

# 2. 작업 디렉터리 생성
WORKDIR /app

# 3. package.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스 복사
COPY . .

# 5. .env 파일은 직접 서버에 업로드하거나 빌드시 복사
# ENV NODE_ENV=production (원할 경우)

# 6. 서버 포트 (5000 등) 열기
EXPOSE 5001

# 7. 서버 실행
CMD ["npm", "start"]