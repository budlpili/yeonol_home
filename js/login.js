    // 탭 전환 기능
    const tabs = document.querySelectorAll('.login-tab');
    const forms = document.querySelectorAll('.login-form-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.tab;
            
            // 탭 활성화
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 폼 전환
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === targetForm + 'Form') {
                    form.classList.add('active');
                }
            });
        });
    });

    // 비밀번호 강도 체크 함수
    function checkPasswordStrength(password) {
        if (password === '') return 0;

        let strength = 0;
        const lengthValid = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (lengthValid) strength += 33.33;
        if (hasLetter) strength += 33.33;
        if (hasNumber) strength += 33.33;

        return strength;
    }

    // 비밀번호 입력 필드 이벤트 리스너 (로그인과 회원가입 모두 적용)
    function handlePasswordInput(inputElement, strengthTextElement) {
        const passwordStatus = document.getElementById('passwordStatus');

        inputElement.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            // 비밀번호 입력 여부에 따라 상태 메시지 표시/숨김
            if (password === '') {
                passwordStatus.style.display = 'block';  // 비밀번호가 비어있으면 메시지 표시
                strengthTextElement.textContent = '';
                strengthTextElement.className = 'strength-text';
            } else {
                passwordStatus.style.display = 'none';   // 비밀번호 입력 시 메시지 숨김
                
                // 강도에 따른 텍스트와 클래스 변경
                if (strength < 33.33) {
                    strengthTextElement.textContent = '비밀번호 강도: 위험';
                    strengthTextElement.className = 'strength-text danger';
                } else if (strength < 66.66) {
                    strengthTextElement.textContent = '비밀번호 강도: 보통';
                    strengthTextElement.className = 'strength-text warning';
                } else if (strength < 99.99) {
                    strengthTextElement.textContent = '비밀번호 강도: 양호';
                    strengthTextElement.className = 'strength-text good';
                } else {
                    strengthTextElement.textContent = '비밀번호 강도: 안전';
                    strengthTextElement.className = 'strength-text success';
                }
            }

            // 회원가입 폼의 경우 추가 검증
            if (this.id === 'signupPassword') {
                const lengthValid = password.length >= 8;
                const hasLetter = /[a-zA-Z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                
                document.getElementById('length-check').className = lengthValid ? 'valid' : '';
                document.getElementById('letter-check').className = hasLetter ? 'valid' : '';
                document.getElementById('number-check').className = hasNumber ? 'valid' : '';

                // 비밀번호 확인 필드 체크
                const confirmPassword = document.getElementById('confirmPassword');
                if (confirmPassword.value !== '') {
                    const matchText = document.querySelector('.match-text');
                    if (password === confirmPassword.value) {
                        matchText.textContent = '비밀번호가 일치합니다.';
                        matchText.className = 'match-text success';
                        document.getElementById('confirmError').style.display = 'none';
                    } else {
                        matchText.textContent = '비밀번호가 일치하지 않습니다.';
                        matchText.className = 'match-text error';
                        document.getElementById('confirmError').style.display = 'block';
                    }
                }
            }
        });
    }

    // 이벤트 리스너 등록
    document.addEventListener('DOMContentLoaded', function() {
        // 로그인 폼 비밀번호
        const loginPassword = document.getElementById('loginPassword');
        const loginStrengthText = document.querySelector('.login-strength-text');
        if (loginPassword && loginStrengthText) {
            handlePasswordInput(loginPassword, loginStrengthText);
        }

        // 회원가입 폼 비밀번호
        const signupPassword = document.getElementById('signupPassword');
        const signupStrengthText = document.querySelector('.signup-strength-text');
        if (signupPassword && signupStrengthText) {
            handlePasswordInput(signupPassword, signupStrengthText);
        }

        // 비밀번호 확인 필드
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                const password = document.getElementById('signupPassword').value;
                const matchText = document.querySelector('.match-text');
                
                if (this.value === '') {
                    matchText.textContent = '';
                    matchText.className = 'match-text';
                } else if (password === this.value) {
                    matchText.textContent = '비밀번호가 일치합니다.';
                    matchText.className = 'match-text success';
                    document.getElementById('confirmError').style.display = 'none';
                } else {
                    matchText.textContent = '비밀번호가 일치하지 않습니다.';
                    matchText.className = 'match-text error';
                    document.getElementById('confirmError').style.display = 'block';
                }
            });
        }
    });

    // 로그인 폼 제출
    document.querySelector('#loginForm form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('로그인 시도:', { email, password });
    });

    // 회원가입 폼 제출
    document.querySelector('#signupForm form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const nickname = document.getElementById('nickname').value;
        
        // 비밀번호 요구사항 검사
        const isValidPassword = 
            password.length >= 8 && 
            /[a-zA-Z]/.test(password) && 
            /[0-9]/.test(password);

        if (!isValidPassword) {
            document.getElementById('passwordError').style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            document.getElementById('confirmError').style.display = 'block';
            return;
        }

        console.log('회원가입 시도:', { email, password, nickname });
    });

    // 비밀번호 찾기 링크
    document.getElementById('forgotPassword').addEventListener('click', function(e) {
        e.preventDefault();
        alert('비밀번호 재설정 페이지로 이동합니다.');
    });

    // CSS 스타일이 제대로 적용되어 있는지 확인하세요
    const styles = `
        .strength-text {
            margin-top: 5px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .strength-text.danger {
            color: #ff4444;
        }

        .strength-text.warning {
            color: #ffa700;
        }

        .strength-text.good {
            color: #ffdd00;
        }

        .strength-text.success {
            color: #00c851;
        }
    `;

    // 스타일 동적 추가
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);