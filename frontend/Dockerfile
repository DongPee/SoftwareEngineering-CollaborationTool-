# 1단계: 빌드
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2단계: 실행
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]