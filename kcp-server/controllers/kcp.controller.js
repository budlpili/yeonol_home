const User = require('../models/user.model');

const kcpController = {
    // 인증 검증
    async verifyAuth(req, res) {
        try {
            const {
                phoneNumber,
                name,
                birthDate,
                gender,
                authToken,
                ci,
                di
            } = req.body;

            // 1. 필수 데이터 검증
            if (!phoneNumber || !name || !ci || !di) {
                return res.status(400).json({
                    success: false,
                    message: '필수 인증 정보가 누락되었습니다.'
                });
            }

            // 2. 중복 가입 확인
            const existingUser = await User.findOne({ ci });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: '이미 가입된 사용자입니다.'
                });
            }

            // 3. 인증 정보 저장
            const user = new User({
                phoneNumber,
                name,
                birthDate,
                gender,
                ci,
                di,
                authToken,
                authDate: new Date()
            });

            await user.save();

            res.json({
                success: true,
                message: '인증이 완료되었습니다.',
                data: {
                    userId: user._id,
                    phoneNumber: user.phoneNumber,
                    name: user.name
                }
            });

        } catch (error) {
            console.error('인증 처리 오류:', error);
            res.status(500).json({
                success: false,
                message: '서버 오류가 발생했습니다.'
            });
        }
    },

    // KCP 콜백 처리
    async handleCallback(req, res) {
        try {
            const { res_cd, res_msg, ...authData } = req.body;
            
            if (res_cd === '0000') {
                // 인증 성공 처리
                console.log('KCP 인증 성공:', authData);
                res.json({ success: true });
            } else {
                // 인증 실패 처리
                console.log('KCP 인증 실패:', res_msg);
                res.status(400).json({
                    success: false,
                    message: res_msg
                });
            }
        } catch (error) {
            console.error('콜백 처리 오류:', error);
            res.status(500).json({
                success: false,
                message: '서버 오류가 발생했습니다.'
            });
        }
    },

    // 에러 처리
    handleError(req, res) {
        console.error('KCP 에러:', req.body);
        res.status(400).json({
            success: false,
            message: '인증 처리 중 오류가 발생했습니다.'
        });
    }
};

module.exports = kcpController;
