import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import http from 'http';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import cron from 'node-cron';
import { S3Client } from '@aws-sdk/client-s3';
dotenv.config({ path: '.env.local' });
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('isChanged', () => {
        io.emit('isChanged');
    });

    socket.on('isModalChanged', () => {
        io.emit('isModalChanged');
    });

    socket.on('disconnect', () => {
        console.log('클라이언트 연결 해제:', socket.id);
    });
});
app.use(cors());//{ origin: "http://localhost:3000" }
app.use(express.json());

const s3 = new S3Client({
   credentials: {
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   },
   region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`;
      cb(null, `uploads/${fileName}`);
    },
  }),
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('🔥 upload route 진입');
  console.log('📂 req.file:', req.file);
  console.log('📂 req.body:', req.body);
  try {
    if (!req.file) {
      console.error('❌ 파일이 업로드되지 않았습니다.');
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }

    const fileUrl = req.file.location;
    console.log('✅ 업로드된 파일 URL:', fileUrl);

    return res.status(200).json({ fileUrl });
  } catch (error) {
    console.error('❌ 파일 업로드 실패:', error);
    return res.status(500).json({ error: '파일 업로드 중 오류 발생' });
  }
});

import { v4 as uuidv4 } from 'uuid';
// MySQL 연결 정보
const db = mysql.createPool({
    host: process.env.SERVER_HOST,
    user: process.env.SERVER_USERNAME,
    password: process.env.SERVER_PASSWORD,
    database: process.env.SERVER_DATABASE_NAME,
    timezone: 'Z'
});

// 랜덤 인증 코드 생성 함수
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자
}

// 이메일로 인증 코드 보내는 함수
async function sendVerificationEmail(email, verificationCode) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASSWORD, 
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: '이메일 인증 코드',
            text: `회원가입을 위한 인증 코드: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
        console.log('인증 코드 이메일 전송 성공');
    } catch (error) {
        console.error('이메일 전송 오류:', error);
    }
}


async function sendDueSoonEmail(email, cardTitle, endDate, time) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `[마감 임박] 카드 '${cardTitle}'의 마감일이 ${time} 남았습니다!`,
    text: `안녕하세요! 담당하신 카드 '${cardTitle}'의 마감일 (${endDate})이 정확히 ${time} 남았습니다. 프로젝트를 확인해 주세요.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ ${email}에게 마감 임박 이메일 전송 완료`);
  } catch (error) {
    console.error(`❌ 이메일 전송 실패 (${email}):`, error);
  }
}



async function sendEmailToManager(email, cardTitle) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `카드 '${cardTitle}'에 담당자로 설정되었습니다.`,
    text: `안녕하세요! 카드 '${cardTitle}'에 담당자로 설정되었습니다. 프로젝트를 확인해 주세요.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ ${email}에게 이메일 전송 완료`);
  } catch (error) {
    console.error(`❌ 이메일 전송 실패 (${email}):`, error);
  }
}



cron.schedule('0 0 * * *', async () => {
  console.log('📨 [알림] 마감 1주 전 카드 확인 스케줄러 실행');

  try {
    const [rows] = await db.query(`
      SELECT c.id, c.title, c.endDate, u.email
      FROM card_table c
      JOIN user_info u ON c.manager = u.id
      WHERE c.endDate = DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    `);

    for (const card of rows) {
      await sendDueSoonEmail(card.email, card.title, card.endDate.toISOString().split('T')[0], "1주일");
    }

    console.log('📬 마감 임박 이메일 알림 완료');
  } catch (error) {
    console.error('🚨 마감 알림 스케줄러 오류:', error);
  }
});



cron.schedule('0 0 * * *', async () => {
  console.log('📨 [알림] 마감 1일 전 카드 확인 스케줄러 실행');

  try {
    const [rows] = await db.query(`
      SELECT c.id, c.title, c.endDate, u.email
      FROM card_table c
      JOIN user_info u ON c.manager = u.id
      WHERE c.endDate = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    `);

    for (const card of rows) {
      await sendDueSoonEmail(card.email, card.title, card.endDate.toISOString().split('T')[0], "1일");
    }

    console.log('📬 마감 임박 이메일 알림 완료');
  } catch (error) {
    console.error('🚨 마감 알림 스케줄러 오류:', error);
  }
});



app.post("/api/analyze", async (req, res) => {
  const text = req.body.text || "";

  // 키워드 기반 리다이렉트 처리
  if (text.includes("프로젝트") && text.includes("이동")) {
    return res.json({ redirect_url: "/projectList" });
  } else if (text.includes("로그인") && text.includes("이동")) {
    return res.json({ redirect_url: "/login" });
  } else if (text.includes("회원가입") && text.includes("이동")) {
    return res.json({ redirect_url: "/signup" });
  } else if (text.includes("메인") && text.includes("이동")) {
    return res.json({ redirect_url: "/" });
  }

  // GPT-3.5-turbo 응답
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 또는 "gpt-4"
      messages: [{ role: "user", content: text }],
    });

    const responseText = completion.choices[0].message.content;

    return res.json({
      gpt_response: responseText,
    });
  } catch (err) {
    console.error("GPT 응답 에러:", err);
    return res.status(500).json({ error: "GPT 요청 실패" });
  }
});



app.post('/api/request-verification', async (req, res) => {
    const { email, username} = req.body;

    if (!email || !username) {
        return res.status(400).json({ error: "사용자 이름과 이메일을 입력해야 합니다." });
    }

    try {
        const verificationCode = generateVerificationCode();
        await db.query(
            'INSERT INTO user_info (username, email, verification_code, is_verified) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE verification_code = ?, is_verified = 0',
            [username, email, verificationCode, false, verificationCode]
        );

        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: "인증 코드가 이메일로 전송되었습니다." });
    } catch (err) {
        console.error("인증 코드 요청 오류:", err);
        res.status(500).json({ error: "인증 코드 요청 중 오류가 발생했습니다." });
    }
});



app.post('/api/changePassword', async(req, res) => {
    const { email, password } = req.body;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+]).{8,}$/;
    if (!email || !password) {
        return res.status(400).json({ error: "이메일과 비밀번호를 입력해야 합니다." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "비밀번호는 최소 8자 이상이며, 특수문자를 포함해야 합니다." });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE user_info SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
        res.status(200).json({ message: "비밀번호가 변경되었습니다. " });
    } catch (err) {
        console.error("비밀번호 변경 오류", err);
        res.status(500).json({ error: "비밀번호 변경 오류" });
    }
});



app.post('/api/lost-password-request-verification', async (req, res) => {
    const { email} = req.body;

    if (!email) {
        return res.status(400).json({ error: "이메일을 입력해야 합니다." });
    }

    try {
        const [rows] = await db.query('SELECT password_hash FROM user_info WHERE email = ?', [email]);
        const { password_hash } = rows[0];
        if (password_hash === "kakao" || password_hash === "goggle") {
            return res.status(400).json({ message: "소셜 로그인은 비밀번호를 찾을 수 없습니다." });
        }
        const verificationCode = generateVerificationCode();
        await db.query(
            'UPDATE user_info SET verification_code = ?, is_verified = ? WHERE email = ?',
            [verificationCode, 0, email]
        );

        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: "인증 코드가 이메일로 전송되었습니다." });
    } catch (err) {
        console.error("인증 코드 요청 오류:", err);
        res.status(500).json({ error: "인증 코드 요청 중 오류가 발생했습니다." });
    }
});



app.post('/api/verify-code', async (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ error: "이메일과 인증 코드를 입력해야 합니다." });
    }

    try {
        const [rows] = await db.query('SELECT verification_code FROM user_info WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }

        if (rows[0].verification_code !== verificationCode) {
            return res.status(400).json({ error: "인증 코드가 올바르지 않습니다." });
        }

        // 인증 완료 처리
        await db.query('UPDATE user_info SET is_verified = 1 WHERE email = ?', [email]);

        res.status(200).json({ message: "이메일 인증이 완료되었습니다." });
    } catch (err) {
        console.error("인증 코드 확인 오류:", err);
        res.status(500).json({ error: "인증 코드 확인 중 오류가 발생했습니다." });
    }
});



// 3. 회원가입 완료 API
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+]).{8,}$/;

    if (!email || !password) {
        return res.status(400).json({ error: "이메일과 비밀번호를 입력해야 합니다." });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "비밀번호는 최소 8자 이상이며, 특수문자를 포함해야 합니다." });
    }

    try {
        // 이메일 인증 여부 확인
        const [rows] = await db.query('SELECT is_verified FROM user_info WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "이메일 인증이 필요합니다." });
        }

        if (!rows[0].is_verified) {
            return res.status(400).json({ error: "이메일 인증이 완료되지 않았습니다." });
        }

        // 비밀번호 해싱 후 저장
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE user_info SET password_hash = ? WHERE email = ?', [hashedPassword, email]);

        res.status(201).json({ message: "회원가입이 완료되었습니다." });
    } catch (err) {
        console.error("회원가입 완료 오류:", err);
        res.status(500).json({ error: "회원가입 처리 중 오류가 발생했습니다." });
    }
});



app.delete("/api/deleteProject", async (req, res) => {
  const { projectId, email } = req.body;
  if (!projectId || !email) {
    return res.status(400).json({ message: "프로젝트 ID 또는 이메일이 필요합니다." });
  }
  try {
    const [result3] = await db.query("select id from user_info where email = ?", [email]);
    if(result3.length === 0){
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const [result2] = await db.query(
      "SELECT role FROM project_members WHERE project_id = ? AND user_id = ?",
      [projectId, result3[0].id]
    );
    if (result2.length === 0) {
      return res.status(404).json({ message: "해당 프로젝트에서 사용자를 찾을 수 없습니다." });
    }
    const { role } = result2[0];
    if (role === "owner") {
      const [result] = await db.query("DELETE FROM projects WHERE id = ?", [projectId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "프로젝트를 찾을 수 없습니다." });
      }
    } else if (role === "member") {
      const [result] = await db.query(
        "DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
        [projectId, result3[0].id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "프로젝트 멤버에서 삭제 실패" });
      }
    }

    res.status(200).json({ message: "프로젝트 삭제 성공" });

  } catch (err) {
    console.error("프로젝트 삭제 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});



// 사용자 조회 API
app.get('/api/users', async (req, res) => {
    const { email} = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM user_info where email = ?', [email]); 
        res.json(rows);
    } catch (err) {
        console.error("데이터베이스 오류:", err);
        res.status(500).json({ error: 'Database connection error' });
    }
});



app.post('/api/tryLogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "이메일과 비밀번호를 입력해야 합니다." });
    }

    try {
        // 이메일로 유저 조회
        const [rows] = await db.query('SELECT username, password_hash, email FROM user_info WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }
        const hashedPassword = rows[0].password_hash;

        // 입력된 비밀번호와 해시 비교
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }
        res.status(200).json({ message: "로그인 성공!", username : rows[0].username, email : email});
    } catch (err) {
        console.error("로그인 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/showProjects', async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.query(`
            SELECT p.id AS project_id, p.name, p.description
            FROM user_info u
            JOIN project_members pm ON u.id = pm.user_id
            JOIN projects p ON pm.project_id = p.id
            WHERE u.email = ?;
        `, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "사용자에게 연결된 프로젝트가 없습니다." });
        }
        console.log(rows)
        res.status(200).json({ projects: rows });

    } catch (err) {
        console.error("프로젝트 불러오기 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/updateProject', async (req, res) => {
    const { projectId, name, desc } = req.body;

    if (!projectId || !name || desc === undefined) {
        return res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
    }

    try {
        const [result] = await db.query(
            `UPDATE projects SET name = ?, description = ? WHERE id = ?`,
            [name, desc, projectId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "해당 프로젝트를 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "프로젝트가 성공적으로 업데이트되었습니다." });
    } catch (err) {
        console.error("프로젝트 수정 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/socialLogin', async (req, res) => {
    const {username, email, social} = req.body;
    let made = false;
    console.log(username);
    console.log(email);
    console.log(social);
    try {
        const [rows] = await db.query(`
            select * from user_info where email= ? 
        `, [email]);
        if(rows.length > 0){
            const [rows3] = await db.query(`
                select * from user_info where password_hash = ?
            `, [rows[0].password_hash])
            if(rows3.length === 0){
                made = true;
            }
            else{
                return res.status(201).json({text : "정보가 있음"});
            }
        }
        else{
            made = true;
        }
        if(made){
            const [rows2] = await db.query(`
                INSERT INTO user_info (username, email, password_hash, is_verified, verification_code)
                VALUES (?, ?, ?, NULL, NULL)
            `, [username, email, social]);
            return res.status(201).json({text : "회원가입됨"});
        }
    } catch (err) {
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/createProject', async (req, res) => {
    const { email, name, desc } = req.body;

    console.log("email:", email, "name:", name, "desc:", desc);

    if (!email || !name) {
        return res.status(400).json({ error: "이메일과 프로젝트 이름이 필요합니다." });
    }

    try {
        // 1. 사용자 ID 가져오기
        const [userRows] = await db.query(
            "SELECT id FROM user_info WHERE email = ?",
            [email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }

        const userId = userRows[0].id;

        // 2. 프로젝트 생성 (desc 포함)
        const [projectResult] = await db.query(
            "INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)",
            [name, desc, userId]
        );
        console.log(projectResult);
        const projectId = projectResult.insertId;

        // 3. 프로젝트 멤버(owner)로 등록
        await db.query(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'owner')",
            [projectId, userId]
        );

        await db.query("INSERT INTO column_table (title, project_id) VALUES (?, ?)", ["할 일", projectId]);
        await db.query("INSERT INTO column_table (title, project_id) VALUES (?, ?)", ["진행 중", projectId]);
        await db.query("INSERT INTO column_table (title, project_id) VALUES (?, ?)", ["완료", projectId]);

        // 4. 생성된 프로젝트 정보 반환
        res.status(201).json({
            message: "프로젝트가 성공적으로 생성되었습니다.",
            project: {
                id: projectId,
                name,
                desc
            }
        });

    } catch (err) {
        console.error("프로젝트 생성 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/createColumn', async (req, res) => {
    const { title, projectId } = req.body;

    if (!title || title.trim() === "" || !projectId) {
        return res.status(400).json({ error: "컬럼 타이틀과 프로젝트 ID가 필요합니다." });
    }

    try {
        const [result] = await db.query("INSERT INTO column_table (title, project_id) VALUES (?, ?)", [title, projectId]);
        // 4. 생성된 프로젝트 정보 반환
        console.log(result);
        res.status(201).json({
            message: "컬럼이 생성되었습니다.",
            project: {
                title: title,
                columnId : result.insertId
            }
        });

    } catch (err) {
        console.error("컬럼 생성 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/deleteColumn', async (req, res) => {
    const { columnId } = req.body;

    if (!columnId) {
        return res.status(400).json({ error: "columnId가 필요합니다." });
    }

    try {
        await db.query("DELETE FROM column_table WHERE id = ?", [columnId]);

        res.status(200).json({
            message: "컬럼이 삭제되었습니다.",
        });

    } catch (err) {
        console.error("컬럼 삭제 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/showColumn', async (req, res) => {
    const { projectId } = req.body;
    if (!projectId) {
        return res.status(400).json({ error: "프로젝트 ID가 필요합니다." });
    }

    try {
        const [result] = await db.query("SELECT * FROM column_table WHERE project_id = ?", [projectId]);
        res.status(200).json({
            message: "컬럼 목록을 불러왔습니다.",
            columns: result
        });
        
    } catch (err) {
        console.error("컬럼 조회 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/showCard', async (req, res) => {
    const { columnId } = req.body;
    if (!columnId) {
        return res.status(400).json({ error: "컬럼 ID가 필요합니다." });
    }

    try {
        const [result] = await db.query("SELECT * FROM card_table WHERE column_id = ?", [columnId]);
        console.log(`${columnId} cards : ${result}`);
        console.log(result);
        res.status(200).json({
            message: "컬럼 목록을 불러왔습니다.",
            cards: result
        });
        
    } catch (err) {
        console.error("컬럼 조회 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/createCard', async (req, res) => {
    const { title, columnId } = req.body;

    if (!title || title.trim() === "" || !columnId) {
        return res.status(400).json({ error: "카드 제목과 컬럼 ID가 필요합니다." });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO card_table (title, column_id) VALUES (?, ?)",
            [title, columnId]
        );

        console.log(result);
        res.status(200).json({
            message: "카드를 추가했습니다.",
            result: result,
        });

    } catch (err) {
        console.error("카드 추가 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/deleteCards', async (req, res) => {
    const { columnId } = req.body;

    if (!columnId) {
        return res.status(400).json({ error: "컬럼 ID가 필요합니다." });
    }

    try {
        const [result] = await db.query(
            "DELETE FROM card_table WHERE column_id = ?",
            [columnId]
        );

        console.log("삭제된 카드 수:", result.affectedRows);

        res.status(200).json({
            message: "해당 컬럼의 모든 카드를 삭제했습니다.",
            deletedCount: result.affectedRows
        });

    } catch (err) {
        console.error("카드 삭제 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});




app.post('/api/deleteCard', async (req, res) => {
    const { columnId, cardId } = req.body;

    if (!columnId || !cardId) {
        return res.status(400).json({ error: "카드 ID가 필요합니다." });
    }

    try {
        const [result] = await db.query(
            "DELETE FROM card_table WHERE column_id = ? and id = ?",
            [columnId, cardId]
        );
    


        res.status(200).json({
            message:`해당 컬럼의 ${cardId} 카드를 삭제했습니다.`,
            deletedCount: result.affectedRows
        });

    } catch (err) {
        console.error("카드 삭제 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});




app.post('/api/createInviteLInk', async (req, res) => {
    const { projectId, inviterEmail } = req.body;

    if (!projectId || !inviterEmail) {
        return res.status(400).json({ error: "프로젝트 id나 초대코드가 유효하지 않습니다." });
    }

    try {
        const token = uuidv4();
        await db.query("INSERT INTO invite_tokens (token, project_id, inviter_email) VALUES (?, ?, ?)", [token, projectId, inviterEmail]);
        
        res.json({
        inviteUrl: `http://43.203.124.34/invite/${token}`
});

    } catch (err) {
        console.error("생성 오류", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});




app.post('/api/createLoginToken', async (req, res) => {
    const { email } = req.body;
    const token = uuidv4();
    try {
        const [rows] = await db.query(
            `INSERT INTO login_tokens (email, token, expires_at)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
            [email, token]
          );
        res.json({token : token});
    } catch (err) {
        console.error("로그인토큰 저장 오류", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/tokenLogin', async (req, res) => {
    const { reEmail, token } = req.body;
    
    if (!reEmail || !token) {
        return res.status(400).json({ error: "다시 로그인해주세요."});
    }

    try {
        // 이메일로 유저 조회
        const [rows] = await db.query('SELECT * FROM login_tokens WHERE token = ? AND email = ? AND expires_at > NOW();', [token, reEmail]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "토큰 만료" });
        }
        const [rows2] = await db.query('SELECT username FROM user_info WHERE email = ?', [reEmail]);

        if(rows2.length === 0){
            
            return res.status(401).json({error : "사용자 정보가 없음"});
        }
        await db.query('delete from login_tokens where expires_at < NOW()');
        res.status(200).json({ message: "로그인 성공!", username : rows2[0].username, email : reEmail});
    } catch (err) {
        console.error("로그인 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/deleteLoginToken', async (req, res) => {
    const { em } = req.body;
    
    if (!em) {
        return res.status(400).json({ error: "이메일이 없습니다."});
    }

    try {
        await db.query('DELETE FROM login_tokens WHERE email = ?', [em]);
        res.status(200).json({ message: "삭제 성공!",});
    } catch (err) {
        console.error("로그인 오류:", err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});




app.post('/api/acceptInvite', async (req, res) => {
    const { token, email} = req.body;
    if (!token) {
        return res.status(400).json({ error: "초대코드가 유효하지 않습니다." });
    }

    try {
        const [rows] = await db.query("SELECT * FROM invite_tokens WHERE token = ?", [token]);
        if(!email) return res.status(400).json({error : "로그인 해주세요"});
        if (rows.length === 0 ) return res.status(400).json({ error: "초대 링크가 유효하지 않음" });
        if(rows[0].used === 1) return res.status(400).json({ error: "이 링크는 만료되었습니다." });

        const projectId = rows[0].project_id;
        const [rows2] = await db.query("select id from user_info where email=?", [email]);
        if (!rows2.length) return res.status(404).json({ error: "해당 이메일의 유저를 찾을 수 없습니다." });
        // 중복 추가 방지
        const [existing] = await db.query(
            "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?",
            [projectId, rows2[0].id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: "이미 프로젝트에 참여 중입니다." });
        }
        await db.query("INSERT INTO project_members (project_id, user_id) VALUES (?, ?)", [projectId, rows2[0].id]);
        await db.query("update invite_tokens set used = ? where token = ?", [1,token]);
        res.json({ projectId });
        

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});


app.post('/api/showProjectUsername', async (req, res) => {
    const {projectId} = req.body;

    if (!projectId) {
        return res.status(400).json({ error: "프로젝트 Id가 없습니다." });
    }

    try {
        const [rows] = await db.query("SELECT ui.username, ui.id FROM project_members pm JOIN user_info ui ON pm.user_id = ui.id WHERE pm.project_id = ?;", [projectId]);
        if (rows.length === 0 ) return res.status(400).json({ error: "사용자가 없음" });
        res.json({ rows });
        

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/showProjectUsernameRole', async (req, res) => {
    const {projectId} = req.body;

    if (!projectId) {
        return res.status(400).json({ error: "프로젝트 Id가 없습니다." });
    }

    try {
        const [rows] = await db.query("SELECT ui.username, ui.id, pm.role FROM project_members pm JOIN user_info ui ON pm.user_id = ui.id WHERE pm.project_id = ?;", [projectId]);
        if (rows.length === 0 ) return res.status(400).json({ error: "사용자가 없음" });
        res.json({ rows });
        

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/changeRole', async (req, res) => {
    const { projectId, user_id, role } = req.body;

    if (!projectId || !user_id || !role) {
        return res.status(400).json({ error: "프로젝트 ID, user ID, role이 없습니다." });
    }

    try {
        const [result] = await db.query(
            "UPDATE project_members SET role = ? WHERE project_id = ? AND user_id = ?",
            [role, projectId, user_id]
        );

        // ✅ 변경된 행이 있는지 확인
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "해당 유저가 존재하지 않거나 역할이 변경되지 않았습니다." });
        }

        res.json({ success: true, message: "역할이 성공적으로 변경되었습니다." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/addComment', async (req, res) => {
    const { cardId, content, email, fileUrl} = req.body;
    if (!cardId || !content || !email) {
      return res.status(400).json({ error: "cardId 또는 내용 또는 사용자가 없습니다." });
    }
  
    try {
        const [userResult] = await db.query("SELECT id, username, email FROM user_info WHERE email = ?", [email]);
    
        if (userResult.length === 0) {
            console.log("no data");
            throw new Error("해당 email에 해당하는 사용자가 없습니다.");
        }
        const authorId = userResult[0].id;
        const author = userResult[0].username;
        const author_email = userResult[0].email;
        console.log(userResult);
        const [result] = await db.query(
            "INSERT INTO comment_table (content, cards_id, author, author_username, author_email, file_url) VALUES (?, ?, ?, ?, ?, ?)",
            [content, cardId, authorId, author, author_email, fileUrl]
        );
        console.log(result);
      res.json({ id: result.insertId, author : author, author_email : author_email, file_url : fileUrl}); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/editComment', async (req, res) => {
    const { commentId, content, cardId } = req.body;
  
    if (!commentId || !content || !cardId) {
        return res.status(400).json({ error: "commentId, content, cardId가 없습니다." });
    }
  
    try {
        const [result] = await db.query(
            "update comment_table set content = ? where id = ? and cards_id = ?", 
            [content, commentId, cardId]
        );
      
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
        }

        res.json({ message: "댓글이 수정되었습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/deleteComment', async (req, res) => {
    const { commentId } = req.body;
  
    if (!commentId) {
        return res.status(400).json({ error: "commentId가 없습니다." });
    }
  
    try {
        const [result] = await db.query(
            "delete from comment_table where id = ?", 
            [commentId]
        );
      
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
        }

        res.json({ message: "댓글이 삭제되었습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/getComments', async (req, res) => {
    const { cardId } = req.body;
    if (!cardId) {
        res.json([]);
        return ;
    }
    try {
      const [rows] = await db.query(
        'SELECT content, author_username, author_email, id, file_url FROM comment_table WHERE cards_id = ?',
        [cardId]
      );
      if(rows.length === 0){
        res.json([]);
        return;
      }
      const comments = rows.map(row => ({
        text: row.content,
        author: row.author_username,
        author_email : row.author_email,
        id : row.id,
        file_Url : row.file_url
      }));
  
      console.log("댓글 데이터:", comments);
      res.json(comments); 
    } catch (err) {
      console.error('댓글 조회 중 오류 발생:', err);
      res.status(500).json({ error: '서버 오류 발생' });
    }
  });
  


app.post('/api/setStartEndDate', async (req, res) => {
    const { cardId, startDate, endDate} = req.body;
    if (!cardId) {
        return res.status(400).json({ error: "cardId가 없습니다." });
    }

    try {
        const [rows] = await db.query("update card_table set startDate = ?, endDate = ? WHERE id = ?", [startDate, endDate, cardId]);
        res.json({ rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/setCardManager', async (req, res) => {
    const { cardId, assignee} = req.body;
    if (!cardId) {
        return res.status(401).json({ error: "cardId 또는 담당자가 없습니다." });
    }
    try {
        const [rows] = await db.query("update card_table set manager = ? WHERE id = ?", [assignee, cardId]);
        const [rows2] = await db.query("select email from user_info where id = ?", [assignee]);
        if(rows2.length === 0){
            return res.status(401).json({error : "사용자가 없습니다."});
        }
        const [rows3] = await db.query("select title from card_table where id = ?", [cardId]);
        if(rows3.length === 0){
            return res.status(401).json({error : "카드가 없습니다."});
        }
        await sendEmailToManager(rows2[0].email, rows3[0].title);

        res.json({ rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});


app.post('/api/updateProjectNameDesc', async (req, res) => {
    const { projectId, name, desc} = req.body;
    if (!projectId) {
        return res.status(401).json({ error: "projectId가 없습니다." });
    }
    try {
        const [rows] = await db.query("update projects set name = ?, description = ? WHERE id = ?", [name, desc, projectId]);
        return res.status(200).json({message : "이름, 설명 변경 완료"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});




app.post('/api/getDescCardManagerStartEndDate', async (req, res) => {
    const { cardId } = req.body;
    if (!cardId ) {
        return res.status(400).json({ error: "cardId가 없습니다." });
    }
    try {
        const [rows] = await db.query(
            "SELECT manager, startDate, endDate, card_desc FROM card_table WHERE id = ?", 
            [cardId]
        );
        if (rows.length === 0) {
            throw new Error("해당 카드에 해당하는 데이터가 없습니다.");
        }
        const { manager, startDate, endDate, card_desc } = rows[0];

        const [rows2] = await db.query(
            "SELECT username FROM user_info WHERE id = ?", 
            [manager]
        );
        if (rows.length === 0) {
            throw new Error("사용자 정보가 없습니다.");
        }
        const username = rows2.length > 0 ? rows2[0].username : null;
        res.json({ manager, startDate, endDate, username, card_desc});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});




app.post('/api/setCard_desc', async (req, res) => {
    const { cardId, card_desc} = req.body;
    
    if (!cardId ) {
        return res.status(400).json({ error: "cardId 또는 담당자가 없습니다." });
    }
    const safeDesc = card_desc ?? "";
    try {
        const [rows] = await db.query("update card_table set card_desc = ? WHERE id = ?", [safeDesc, cardId]);
        res.json({ rows });
        console.log(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/setChat', async (req, res) => {
    const { user, content, project_id} = req.body;

    if (!user || !content) {
        return res.status(400).json({ error: "user(email) 또는 content가 없습니다." });
    }
    try {
        const [result2] = await db.query(
            'SELECT id, username FROM user_info WHERE email = ?', [user]
        );
        if (result2.length === 0) {
            return res.status(400).json({ error: 'email이 존재하지 않음' });
        }
        const userId = result2[0].id;
        const username = result2[0].username;
        const [result] = await db.query(
            'INSERT INTO chat_messages (user_id, content, project_id) VALUES (?, ?, ?)',
            [userId, content, project_id]
        );
        const insertId = result.insertId;
        const [result3] = await db.query(
            'SELECT id, content, created_at FROM chat_messages WHERE id = ?', [insertId]
        );
        if (result3.length === 0) {
            return res.status(400).json({ error: 'message가 존재하지 않음' });
        }
        const message = {
            id: result3[0].id,
            text: result3[0].content,
            created_at: result3[0].created_at,
            sender: username,
        };
        res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});
  


app.post('/api/getChat', async (req, res) => {
    const {project_id} = req.body;
    if(!project_id) return res.status(400).json({error:'project id가 없음'});
    try {
        const [rows] = await db.query(
                `SELECT c.id, c.content, CONVERT_TZ(c.created_at, '+00:00', '+09:00') AS created_at, u.username AS sender
                FROM chat_messages c
                JOIN user_info u ON c.user_id = u.id
                where c.project_id = ?
                ORDER BY c.created_at ASC`, [project_id]);
        if (rows.length === 0) {
            return res.json([]);
        }
        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/getUserId', async (req, res) => {
    const { email } = req.body;
    
    if (!email ) {
        return res.status(400).json({ error: "email이 없습니다." });
    }
    try {
        const [rows] = await db.query("select id from user_info WHERE email = ?", [email]);
        if(rows.length === 0){
            return res.json({error : "데이터가 없음!"});
        }
        res.json({ id : rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});


  
app.post('/api/dragCard', async (req, res) => {
    const { cardId, columnId } = req.body;
    
    if (!cardId || !columnId ) {
        return res.status(400).json({ error: "카드id 또는 컬럼id가 없습니다." });
    }
    try {
        const [rows] = await db.query("update card_table set column_id = ? where id = ?", [columnId, cardId]);
        res.json({message : "카드 옮기기 성공"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post('/api/checkOwner', async (req, res) => {
    const { email, project_id } = req.body;

    if (!email || !project_id) {
        return res.status(400).json({ error: "이메일 또는 프로젝트 ID가 없습니다." });
    }
    try {
        const [rows] = await db.query(
            `SELECT pm.role
             FROM project_members pm
             JOIN user_info ui ON pm.user_id = ui.id
             WHERE ui.email = ? AND pm.project_id = ?`,
            [email, project_id]
        );
        if(rows.length === 0){
            return res.json({error : "데이터가 없음"});
        }
        res.json({role : rows[0].role});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post("/api/writeLog", async (req, res) => {
    const { log_type, content,  author_email, projectId} = req.body;

    if (!log_type || !content || !author_email || !projectId) {
        return res.status(400).json({ error: "로그 쓰기 실패" });
    }
    try {
        const [rows2] = await db.query(
            `select id from user_info where email = ?`,
            [author_email]
        );
        if(rows2.length === 0){
            return res.status(400).json({message:"사용자 없음"});
        }
        const author_id = rows2[0].id;
        const [rows] = await db.query(
            `insert into logs(author, log_type, content, project_Id) values(?, ?, ?, ?)`,
            [author_id, log_type, content, projectId]
        );
        return res.status(200).json({"message" : "쓰기 성공"}) 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});



app.post("/api/getLog", async (req, res) => {
    const { projectId } = req.body;

    if (!projectId) {
        return res.status(400).json({ error: "로그조회실패" });
    }

    try {
        const [rows] = await db.query(
            `
            SELECT 
                id,
                author,
                log_type,
                content,
                DATE_ADD(created_at, INTERVAL 9 HOUR) AS created_at,
                project_id
            FROM logs
            WHERE project_id = ?
            ORDER BY created_at DESC
            `,
            [projectId]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류 발생" });
    }
});


app.post('/api/editCardTitle', async (req, res) => {
  const { name, card_id } = req.body;
  if (!name || !card_id) {
    return res.status(400).json({ error: "name 또는 card_id가 없습니다." });
  }
  try {
    const [result] = await db.query(
      "UPDATE card_table SET title = ? WHERE id = ?",
      [name, card_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "해당 카드가 존재하지 않습니다." });
    }
    res.json({ message: "카드 제목 수정 성공", card_id });
  } catch (err) {
    console.error("카드 제목 수정 오류:", err);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});



app.get('/', (req, res) => {
  res.send("백엔드 서버 실행 중!");
});


server.listen(5001, () => {
    console.log('Server is running on port 5001');
  });
