import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// MySQL 연결 정보
const db = mysql.createPool({
    host: 'swep-db.chcwouumglg8.ap-northeast-2.rds.amazonaws.com',
    user: 'swepusername',
    password: 'swep0515!',
    database: 'swepdb'
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
                user: 'kmjnet12@gmail.com',  // 실제 Gmail 주소 입력
                pass: 'pvoyqqtfawrivojx', // 앱 비밀번호
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
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

// 1. 인증 코드 요청 API
app.post('/api/request-verification', async (req, res) => {
    const { email, username } = req.body;

    if (!email || !username) {
        return res.status(400).json({ error: "이메일과 사용자 이름을 입력해야 합니다." });
    }

    try {
        const verificationCode = generateVerificationCode();

        // 인증 코드 저장 (비밀번호 없이 저장, 기존 데이터 덮어쓰기)
        await db.query(
            'INSERT INTO user_info (username, email, verification_code, is_verified) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE verification_code = ?, is_verified = 0',
            [username, email, verificationCode, false, verificationCode]
        );

        // 인증 코드 이메일 전송
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({ message: "인증 코드가 이메일로 전송되었습니다." });
    } catch (err) {
        console.error("인증 코드 요청 오류:", err);
        res.status(500).json({ error: "인증 코드 요청 중 오류가 발생했습니다." });
    }
});

// 2. 인증 코드 확인 API
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

// 사용자 조회 API
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user_info'); 
        res.json(rows);
    } catch (err) {
        console.error("데이터베이스 오류:", err);
        res.status(500).json({ error: 'Database connection error' });
    }
});
app.listen(5001, () => {
    console.log('Server is running on port 5001');
});