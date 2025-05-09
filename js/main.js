document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    
    // 네비게이션 메뉴 업데이트 함수
    function updateNavigationMenu(isLoggedIn) {
        // nav-links 업데이트
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            if (isLoggedIn) {
                // 로그인 상태일 때
                navLinks.innerHTML = `
                    <li><a href="../index.html">홈</a></li>
                    <li><a href="../board_com/community.html">커뮤니티</a></li>
                    <li><a href="../board_gallery/gallery.html">핫플레이스</a></li>
                    <li><a href="../customer-service.html">고객센터</a></li>
                    <li><a href="#" id="logoutBtn">로그아웃</a></li>
                    <li><a href="../my-info.html">내정보</a></li>
                `;
            } else {
                // 로그아웃 상태일 때
                navLinks.innerHTML = `
                    <li><a href="../index.html">홈</a></li>
                    <li><a href="../board_com/community.html">커뮤니티</a></li>
                    <li><a href="../board_gallery/gallery.html">핫플레이스</a></li>
                    <li><a href="../customer-service.html">고객센터</a></li>
                    <li><a href="../login.html">로그인</a></li>
                `;
            }
        }

        // login-links 업데이트
        const loginLinks = document.querySelector('.login-links');
        if (loginLinks) {
            if (isLoggedIn) {
                // 로그인 상태일 때
                loginLinks.innerHTML = `
                    <li><a href="./my-info.html" class="my-info-link">내정보</a></li>
                `;
            } else {
                // 로그아웃 상태일 때
                loginLinks.innerHTML = '';
            }
        }

        // 로그아웃 버튼 이벤트 리스너 재설정
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                Swal.fire({
                    title: '정말 로그아웃 하시겠습니까?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '로그아웃',
                    cancelButtonText: '취소',
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // 세션 스토리지 클리어
                        sessionStorage.clear();
                        // 네비게이션 메뉴 업데이트
                        updateNavigationMenu(false);
                        // 로그인 페이지로 이동
                        window.location.href = 'login.html';
                    }
                });
            });
        }
    }

    // 페이지 로드 시 로그인 상태 확인 및 네비게이션 메뉴 업데이트
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    updateNavigationMenu(isLoggedIn);

    // 스크롤 이벤트 처리
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    });

    // 페이지 로드 시 현재 스크롤 위치 확인
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    // 스크롤 애니메이션 처리
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animated');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.visibility = 'visible';
            }
        });
    };

    // 초기 애니메이션 상태 설정
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        element.style.visibility = 'hidden';
    });

    // 스크롤 이벤트에 애니메이션 처리 추가
    let animationTimeout;
    window.addEventListener('scroll', function() {
        if (animationTimeout) {
            window.cancelAnimationFrame(animationTimeout);
        }
        animationTimeout = window.requestAnimationFrame(animateOnScroll);
    });

    // 페이지 로드 시에도 애니메이션 체크
    window.addEventListener('load', animateOnScroll);
    // 초기 로드 시에도 한 번 체크
    animateOnScroll();

    // 메뉴 토글
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // 스크롤 시 네비게이션 바 스타일 변경
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let navbarScrollTimeout;
        window.addEventListener('scroll', function() {
            if (navbarScrollTimeout) {
                window.cancelAnimationFrame(navbarScrollTimeout);
            }
            
            navbarScrollTimeout = window.requestAnimationFrame(function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        });
    }

    // DOM 변경 감지를 위한 MutationObserver
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const newElements = mutation.addedNodes;
                newElements.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('nav-links')) {
                            const links = node.querySelectorAll('a');
                            links.forEach(link => {
                                link.addEventListener('click', function() {
                                    navLinks.classList.remove('active');
                                    menuToggle.classList.remove('active');
                                });
                            });
                        }
                    }
                });
            }
        });
    });

    // 감시 설정
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 스무스 스크롤
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 이미지 레이지 로딩
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    };

    // 이미지 레이지 로딩 실행
    lazyLoadImages();

    // 페이지 상단으로 이동하는 버튼 기능
    const pageTopBtn = document.getElementById('pageTop');
    
    if (pageTopBtn) {
        let pageTopScrollTimeout;
        window.addEventListener('scroll', function() {
            if (pageTopScrollTimeout) {
                window.cancelAnimationFrame(pageTopScrollTimeout);
            }
            
            pageTopScrollTimeout = window.requestAnimationFrame(function() {
                if (window.scrollY > 100) {
                    pageTopBtn.classList.add('show');
                } else {
                    pageTopBtn.classList.remove('show');
                }
            });
        });

        pageTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 이미지 스크롤 애니메이션
    function handleDescriptionCardsAnimation() {
        const imageContainers = document.querySelectorAll('.daily-img-container');
        
        imageContainers.forEach(container => {
            const containerTop = container.getBoundingClientRect().top;
            const containerBottom = container.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (containerTop < windowHeight * 0.8 && containerBottom > 0) {
                const images = container.querySelectorAll('img:not(:nth-child(1))');
                images.forEach((img, index) => {
                    setTimeout(() => {
                        img.classList.add('visible');
                    }, index * 400);
                });
            }
        });
    }

    // 스크롤 이벤트 리스너 등록
    let cardsAnimationTimeout;
    window.addEventListener('scroll', function() {
        if (cardsAnimationTimeout) {
            window.cancelAnimationFrame(cardsAnimationTimeout);
        }
        cardsAnimationTimeout = window.requestAnimationFrame(handleDescriptionCardsAnimation);
    });

    // 페이지 로드 시에도 체크
    window.addEventListener('load', handleDescriptionCardsAnimation);
    // 초기 로드 시에도 한 번 체크
    handleDescriptionCardsAnimation();

    // 신고 버튼 클릭 이벤트
    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            location.href = 'report-write.html';
        });
    }

    // PortOne SDK 초기화 관련 코드
    window.portOneInitialized = false;

    // SDK 초기화 함수
    function initializePortOne() {
        return new Promise((resolve, reject) => {
            if (window.PortOne && typeof window.PortOne.requestIdentityVerification === 'function') {
                console.log('PortOne SDK already initialized');
                window.portOneInitialized = true;
                resolve(window.PortOne);
                return;
            }

            // SDK 스크립트 로드 확인
            const sdkScript = document.querySelector('script[src*="portone.io"]');
            if (!sdkScript) {
                reject(new Error('PortOne SDK script not found'));
                return;
            }

            // SDK 초기화 대기
            let attempts = 0;
            const maxAttempts = 40;
            
            function checkSDK() {
                attempts++;
                console.log(`Checking PortOne SDK (${attempts}/${maxAttempts})...`);
                
                if (window.PortOne && typeof window.PortOne.requestIdentityVerification === 'function') {
                    console.log('PortOne SDK initialized successfully');
                    window.portOneInitialized = true;
                    resolve(window.PortOne);
                    return;
                }
                
                if (attempts >= maxAttempts) {
                    reject(new Error('SDK initialization timeout'));
                    return;
                }
                
                setTimeout(checkSDK, 500);
            }
            
            // 초기화 체크 시작
            checkSDK();
        });
    }

    // SDK 스크립트 로드 완료 후 초기화
    const sdkScript = document.querySelector('script[src*="portone.io"]');
    if (sdkScript) {
        if (sdkScript.complete) {
            console.log('PortOne SDK script already loaded, initializing...');
            initializePortOne()
                .then(() => {
                    console.log('PortOne SDK ready to use');
                })
                .catch(error => {
                    console.error('Failed to initialize PortOne SDK:', error);
                });
        } else {
            sdkScript.addEventListener('load', () => {
                console.log('PortOne SDK script loaded, initializing...');
                initializePortOne()
                    .then(() => {
                        console.log('PortOne SDK ready to use');
                    })
                    .catch(error => {
                        console.error('Failed to initialize PortOne SDK:', error);
                    });
            });
        }
    }

    // 본인인증 요청 함수
    window.requestCertification = function() {
        console.log('Requesting certification, SDK initialized:', window.portOneInitialized);
        if (!window.portOneInitialized) {
            console.log('PortOne SDK not initialized, attempting to initialize...');
            initializePortOne()
                .then(portOne => {
                    console.log('PortOne SDK initialized, proceeding with certification...');
                    startCertification(portOne);
                })
                .catch(error => {
                    console.error('Failed to initialize PortOne SDK:', error);
                    Swal.fire({
                        title: '본인인증 서비스 오류',
                        text: '본인인증 서비스를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                });
        } else {
            startCertification(window.PortOne);
        }
    }

    // 실제 본인인증 시작
    function startCertification(portOne) {
        const phoneNumber = document.getElementById('userPhone').value;
        if (!phoneNumber) {
            Swal.fire({
                title: '입력 오류',
                text: '휴대폰 번호를 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        try {
            // 주문 ID 생성 (간단한 형식)
            const orderId = `ORDER_${Date.now()}`;

            portOne.requestIdentityVerification({
                storeId: "store-c136de4f-49d3-47c2-987f-640c8de07831",
                identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
                channelKey: "channel-key-6838f2ce-1dde-42f9-8769-c9b41ef5df5c",
                phoneNumber: phoneNumber,
                ordr_idxx: orderId,
                success: function(data) {
                    console.log('Certification successful:', data);
                    // 인증 성공 처리
                    document.getElementById('verificationSection').style.display = 'none';
                    document.getElementById('newPasswordSection').style.display = 'block';
                },
                fail: function(error) {
                    console.error('Certification failed:', error);
                    Swal.fire({
                        title: '인증 실패',
                        text: '본인인증에 실패했습니다. 다시 시도해주세요.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                }
            });
        } catch (error) {
            console.error('Error during certification:', error);
            Swal.fire({
                title: '본인인증 오류',
                text: '본인인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    }

    // 전화번호 포맷팅 함수
    function formatPhoneNumber(phoneNumber) {
        if (!phoneNumber) return '';
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    }

    // 전화번호 입력 필드 초기화
    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) {
        phoneInput.readOnly = false;
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // 비밀번호 표시/숨기기 토글
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // 비밀번호 유효성 검사
    const passwordInput = document.getElementById('userPw');
    const confirmInput = document.getElementById('userPwConfirm');
    const messageElement = document.querySelector('.form-text');
    const confirmMessage = document.querySelector('.confirm-message');

    if (passwordInput && messageElement) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const hasLength = password.length >= 8 && password.length <= 20;
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            let message = '';
            let color = '';

            if (!password) {
                message = '영문 대/소문자, 숫자, 특수문자 조합 8-20자';
                color = '#6c757d';
            } else if (!hasLength) {
                message = '8-20자 길이로 입력해주세요';
                color = '#dc3545';
            } else if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
                message = '영문 대/소문자, 숫자, 특수문자를 모두 포함해주세요';
                color = '#ffc107';
            } else {
                message = '사용 가능한 비밀번호입니다';
                color = '#198754';
            }

            messageElement.textContent = message;
            messageElement.style.color = color;
            passwordInput.style.borderColor = color;
        });
    }

    // 비밀번호 확인 일치 검사
    if (confirmInput && passwordInput) {
        function checkPasswordMatch() {
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;

            if (!confirmPassword) {
                confirmMessage.textContent = '비밀번호를 한번 더 입력해주세요';
                confirmMessage.style.color = '#6c757d';
                confirmInput.style.borderColor = '';
                return;
            }

            if (password === confirmPassword) {
                confirmMessage.textContent = '비밀번호가 일치합니다';
                confirmMessage.style.color = '#198754';
                confirmInput.style.borderColor = '#198754';
            } else {
                confirmMessage.textContent = '비밀번호가 일치하지 않습니다';
                confirmMessage.style.color = '#dc3545';
                confirmInput.style.borderColor = '#dc3545';
            }
        }

        confirmInput.addEventListener('input', checkPasswordMatch);
        passwordInput.addEventListener('input', function() {
            if (confirmInput.value) {
                checkPasswordMatch();
            }
        });
    }

    // 비밀번호 찾기 폼 제출
    const findPwForm = document.getElementById('findPwForm');
    if (findPwForm) {
        findPwForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('userEmail').value;
            const phone = document.getElementById('userPhone').value;
            const newPassword = document.getElementById('userPw').value;
            const confirmPassword = document.getElementById('userPwConfirm').value;

            // 비밀번호 유효성 검사
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
            if (!passwordRegex.test(newPassword)) {
                Swal.fire({
                    icon: 'error',
                    title: '비밀번호 형식 오류',
                    text: '영문 대/소문자, 숫자, 특수문자를 포함한 8-20자로 입력해주세요.'
                });
                return;
            }

            // 비밀번호 일치 확인
            if (newPassword !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: '비밀번호 불일치',
                    text: '비밀번호가 일치하지 않습니다.'
                });
                return;
            }

            // TODO: 서버에 비밀번호 변경 요청
            // 임시로 성공 메시지 표시
            Swal.fire({
                icon: 'success',
                title: '비밀번호 변경 완료',
                text: '비밀번호가 성공적으로 변경되었습니다.',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                window.location.href = 'login.html';
            });
        });
    }
});