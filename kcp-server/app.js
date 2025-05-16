// app.js (백엔드)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
require('dotenv').config();

// 데이터베이스 연결
connectDB();

const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api/kcp', require('./routes/kcp.routes'));

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: 'KCP 인증 서버가 실행 중입니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});