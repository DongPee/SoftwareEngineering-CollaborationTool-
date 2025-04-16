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
                user: 'swepswepswep15@gmail.com',  // 실제 Gmail 주소 입력
                pass: 'hfmcwefavhkvnfod', // 앱 비밀번호
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
    const { projectId } = req.body;
    console.log(projectId);
    if (!projectId) {
        return res.status(400).json({ message: "프로젝트 ID가 필요합니다." });
    }

    try {
        const result = await db.query("DELETE FROM projects WHERE id = ?", [projectId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "프로젝트를 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "프로젝트 삭제 성공" });
    } catch (err) {
        console.error(err);
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
        
        res.status(201).json({
            message: "컬럼이 생성되었습니다.",
            project: {
                title: title,
                columnId : result[0].insertId
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



app.listen(5001, () => {
    console.log('Server is running on port 5001');
});