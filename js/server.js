const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

// 기본 미들웨어 설정
app.use(express.json());
app.use(cors());

// 보안 헤더 설정
app.use(helmet());

// API 요청 제한 설정
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 5, // IP당 최대 5회
    message: '너무 많은 인증 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
});

// KCP 인증 API에 요청 제한 적용
app.use('/api/kcp/verify', authLimiter);

// 인증번호 저장소 (실제로는 데이터베이스 사용 권장)
const verificationCodes = new Map();

// 인증번호 생성 함수
function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
}

// 라우트 핸들러
app.post('/api/send-verification', (req, res) => {
    try {
        const { phoneNumber, email } = req.body;
        
        // 전화번호나 이메일이 없는 경우
        if (!phoneNumber && !email) {
            return res.status(400).json({
                success: false,
                message: '전화번호 또는 이메일이 필요합니다.'
            });
        }

        // 인증번호 생성
        const verificationCode = generateVerificationCode();
        const expiresAt = Date.now() + 180000; // 3분 후 만료

        // 인증번호 저장
        const key = phoneNumber || email;
        verificationCodes.set(key, {
            code: verificationCode,
            expiresAt: expiresAt
        });

        // TODO: 실제 SMS/이메일 발송 로직 구현
        console.log(`인증번호 발송: ${key} - ${verificationCode}`);

        res.json({
            success: true,
            message: '인증번호가 발송되었습니다.'
        });
    } catch (error) {
        console.error('인증번호 발송 오류:', error);
        res.status(500).json({
            success: false,
            message: '인증번호 발송 중 오류가 발생했습니다.'
        });
    }
});

app.post('/api/verify-code', (req, res) => {
    try {
        const { phoneNumber, email, code } = req.body;
        const key = phoneNumber || email;

        // 입력값 검증
        if (!key || !code) {
            return res.status(400).json({
                success: false,
                message: '필수 정보가 누락되었습니다.'
            });
        }

        // 저장된 인증정보 확인
        const verificationInfo = verificationCodes.get(key);
        if (!verificationInfo) {
            return res.status(400).json({
                success: false,
                message: '인증번호를 먼저 발송해주세요.'
            });
        }

        // 만료 시간 확인
        if (Date.now() > verificationInfo.expiresAt) {
            verificationCodes.delete(key);
            return res.status(400).json({
                success: false,
                message: '인증번호가 만료되었습니다.'
            });
        }

        // 인증번호 확인
        if (verificationInfo.code !== code) {
            return res.status(400).json({
                success: false,
                message: '인증번호가 일치하지 않습니다.'
            });
        }

        // 인증 성공 시 저장된 정보 삭제
        verificationCodes.delete(key);

        res.json({
            success: true,
            message: '인증이 완료되었습니다.'
        });
    } catch (error) {
        console.error('인증번호 확인 오류:', error);
        res.status(500).json({
            success: false,
            message: '인증번호 확인 중 오류가 발생했습니다.'
        });
    }
});

// 라우터 설정
app.use(require('./routes/kcp.controller'));

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 