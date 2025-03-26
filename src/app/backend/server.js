import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

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

// API 엔드포인트
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