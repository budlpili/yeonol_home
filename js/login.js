// jQuery가 로드되었는지 확인
if (typeof jQuery !== 'undefined') {
	$(document).ready(function () {
		// 로그아웃 버튼 이벤트
		$('#logoutBtn').on('click', function (e) {
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
					window.location.href = 'login.html';
				}
			});
		});

		// 비밀번호 보기/숨기기 토글
		$('.toggle-password').on('click', function () {
			const passwordInput = $(this).siblings('input');
			const icon = $(this).find('i');

			if (passwordInput.attr('type') === 'password') {
				passwordInput.attr('type', 'text');
				icon.removeClass('fa-eye').addClass('fa-eye-slash');
			} else {
				passwordInput.attr('type', 'password');
				icon.removeClass('fa-eye-slash').addClass('fa-eye');
			}
		});

		// 비밀번호 확인 보기/숨기기 토글
		$('.toggle-password-confirm').on('click', function () {
			const passwordInput = $(this).siblings('input');
			const icon = $(this).find('i');

			if (passwordInput.attr('type') === 'password') {
				passwordInput.attr('type', 'text');
				icon.removeClass('fa-eye').addClass('fa-eye-slash');
			} else {
				passwordInput.attr('type', 'password');
				icon.removeClass('fa-eye-slash').addClass('fa-eye');
			}
		});

		// 다음 단계로 이동
		$('#nextStepBtn').on('click', function() {
			if (validateStep1()) {
				$('#step1').hide();
				$('#step2').show();
				$('#currentStep').text('2');
				currentStep = 2;
			}
		});

		// 이전 단계로 이동
		$('#prevStepBtn').on('click', function() {
			$('#step2').hide();
			$('#step1').show();
			$('#currentStep').text('1');
			currentStep = 1;
		});

		// Step 1 유효성 검사
		function validateStep1() {
			const email = $('#userEmail').val();
			const password = $('#userPw').val();
			const passwordConfirm = $('#userPwConfirm').val();

			if (!email || !password || !passwordConfirm) {
				Swal.fire({
					icon: 'error',
					title: '입력 오류',
					text: '모든 필드를 입력해주세요.'
				});
				return false;
			}

			if (password !== passwordConfirm) {
				Swal.fire({
					icon: 'error',
					title: '비밀번호 불일치',
					text: '비밀번호가 일치하지 않습니다.'
				});
				return false;
			}

			// 비밀번호 유효성 검사
			const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
			if (!passwordRegex.test(password)) {
				Swal.fire({
					icon: 'error',
					title: '비밀번호 형식 오류',
					text: '영문 대/소문자, 숫자, 특수문자를 포함한 8-20자로 입력해주세요.'
				});
				return false;
			}

			return true;
		}

		// Step 2 유효성 검사
		function validateStep2() {
			const nickname = $('#userNickName').val();
			const phone = $('#userPhone').val();
			const verificationCode = $('#verificationCode').val();
			const agreeTerms = $('#agreeTerms').is(':checked');

			if (!nickname || !phone || !verificationCode) {
				Swal.fire({
					icon: 'error',
					title: '입력 오류',
					text: '모든 필드를 입력해주세요.'
				});
				return false;
			}

			// 닉네임 유효성 검사
			if (nickname.length < 2 || nickname.length > 10) {
				Swal.fire({
					icon: 'error',
					title: '닉네임 형식 오류',
					text: '닉네임은 2-10자 사이로 입력해주세요.'
				});
				return false;
			}

			if (!agreeTerms) {
				Swal.fire({
					icon: 'error',
					title: '약관 동의 필요',
					text: '이용약관 및 개인정보처리방침에 동의해주세요.'
				});
				return false;
			}

			return true;
		}

		// 회원가입 폼 제출
		$('#registerForm').on('submit', function(e) {
			e.preventDefault();
			
			if (!validateStep2()) {
				return;
			}

			const formData = {
				userEmail: $('#userEmail').val(),
				userPw: $('#userPw').val(),
				userNickName: $('#userNickName').val(),
				userPhone: $('#userPhone').val(),
				agreeTerms: $('#agreeTerms').is(':checked')
			};

			$.ajax({
				url: '/api/auth/register',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(formData),
				success: function(response) {
					Swal.fire({
						icon: 'success',
						title: '회원가입 완료',
						text: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
						showConfirmButton: false,
						timer: 2000
					}).then(() => {
						window.location.href = 'login.html';
					});
				},
				error: function(xhr) {
					Swal.fire({
						icon: 'error',
						title: '회원가입 실패',
						text: xhr.responseJSON?.message || '회원가입 중 오류가 발생했습니다.'
					});
				}
			});
		});
	});
}

// reCAPTCHA 콜백 함수
function onRecaptchaSuccess(token) {
	console.log('reCAPTCHA verified');
}

document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM loaded'); // 디버깅용 로그

	// 필요한 DOM 요소들
	const elements = {
		form: document.getElementById('loginForm'),
		idInput: document.getElementById('userEmail'),
		pwInput: document.getElementById('userPw'),
		idCheckbox: document.getElementById('saveId'),
		pwCheckbox: document.getElementById('savePw'),
		socialButtons: document.querySelectorAll('.social-btn'),
		strengthMeter: document.getElementById('password-strength-meter'),
		loginError: document.getElementById('loginError'),
		togglePassword: document.querySelector('.toggle-password')
	};

	console.log('Elements loaded:', elements); // 디버깅용

	// 로그인 폼 제출
	if (elements.form && elements.idInput && elements.pwInput) {
		elements.form.addEventListener('submit', function (e) {
			e.preventDefault();

			const userEmail = elements.idInput.value;
			const userPw = elements.pwInput.value;
			const recaptchaResponse = grecaptcha.getResponse();

			if (!recaptchaResponse) {
				Swal.fire({
					title: '알림',
					text: '캡차 인증을 완료해주세요.',
					icon: 'warning',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
				return;
			}

			// 이메일 형식 검사
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(userEmail)) {
				Swal.fire({
					title: '알림',
					text: '올바른 이메일 형식을 입력해주세요.',
					icon: 'warning',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
				return;
			}

			// TODO: 실제 로그인 API 연동
			// 임시로 하드코딩된 값으로 테스트
			if (userEmail === 'test@test.com' && userPw === 'test123') {
				// 로그인 성공 시 이메일/비밀번호 저장 처리
				const saveId = elements.idCheckbox?.checked;
				const savePw = elements.pwCheckbox?.checked;
				
				if (saveId) {
					localStorage.setItem('savedEmail', userEmail);
				} else {
					localStorage.removeItem('savedEmail');
				}
				
				if (savePw) {
					// 비밀번호는 암호화하여 저장
					const encryptedPw = btoa(userPw); // 간단한 Base64 인코딩 (실제로는 더 강력한 암호화 필요)
					localStorage.setItem('savedPw', encryptedPw);
				} else {
					localStorage.removeItem('savedPw');
				}

				// 로그인 상태 저장 (세션 스토리지 사용)
				sessionStorage.setItem('isLoggedIn', 'true');
				sessionStorage.setItem('currentUser', userEmail);

				// 네비게이션 메뉴 업데이트
				if (typeof updateNavigationMenu === 'function') {
					updateNavigationMenu(true);
				}

				// 로그인 성공 메시지 표시 후 리다이렉트
				Swal.fire({
					title: '로그인 성공',
					text: '메인 페이지로 이동합니다.',
					icon: 'success',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.href = '../index.html';
					}
				});
			} else {
				// 로그인 실패 시 에러 메시지 표시
				elements.loginError.style.display = 'block';
				Swal.fire({
					title: '로그인 실패',
					text: '이메일 또는 비밀번호를 확인하세요.',
					icon: 'error',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
				// 캡차 리셋
				grecaptcha.reset();
			}
		});
	}

	// 저장된 로그인 정보 불러오기
	if (elements.idInput && elements.idCheckbox) {
		const savedEmail = localStorage.getItem('savedEmail');
		if (savedEmail) {
			elements.idInput.value = savedEmail;
			elements.idCheckbox.checked = true;
		}
	}

	if (elements.pwInput && elements.pwCheckbox) {
		const savedPw = localStorage.getItem('savedPw');
		if (savedPw) {
			// 저장된 비밀번호 복호화
			const decryptedPw = atob(savedPw); // Base64 디코딩
			elements.pwInput.value = decryptedPw;
			elements.pwCheckbox.checked = true;
		}
	}

	// 소셜 로그인 버튼 처리
	if (elements.socialButtons.length > 0) {
		elements.socialButtons.forEach(button => {
			button.addEventListener('click', function (e) {
				e.preventDefault();
				const platform = this.querySelector('span')?.textContent || '알 수 없는';
				Swal.fire({
					title: '준비중',
					text: `${platform} 서비스는 현재 준비중입니다.`,
					icon: 'error',
					confirmButtonText: '확인'
				});
			});
		});
	}

	// 비밀번호 강도 체크
	if (elements.pwInput && elements.strengthMeter) {
		const strengthLabel = elements.strengthMeter.querySelector('.strength-label');

		elements.pwInput.addEventListener('input', function () {
			const password = this.value;

			if (!password) {
				elements.strengthMeter.style.display = 'none';
				return;
			}

			elements.strengthMeter.style.display = 'block';
			let score = 0;

			if (password.length >= 8) score += 1;
			if (password.length >= 12) score += 1;
			if (/[0-9]/.test(password)) score += 1;
			if (/[a-z]/.test(password)) score += 1;
			if (/[A-Z]/.test(password)) score += 1;
			if (/[^A-Za-z0-9]/.test(password)) score += 1;

			let strengthClass = '';
			let strengthText = '';

			// if (password.length < 8) {
			// 	strengthClass = 'weak';
			// 	strengthText = '비밀번호가 너무 짧습니다';
			// } else if (score < 3) {
			// 	strengthClass = 'medium';
			// 	strengthText = '비밀번호가 약합니다';
			// } else if (score < 5) {
			// 	strengthClass = 'good';
			// 	strengthText = '비밀번호가 보통입니다';
			// } else {
			// 	strengthClass = 'strong';
			// 	strengthText = '비밀번호가 안전합니다';
			// }

			elements.strengthMeter.className = '';
			elements.strengthMeter.classList.add(strengthClass);
			if (strengthLabel) {
				strengthLabel.textContent = strengthText;
			}
		});
	}

	const passwordInput = document.getElementById('userPw');
	const confirmInput = document.getElementById('userPwConfirm');
	const messageElement = document.querySelector('.form-text');
	const confirmMessage = document.querySelector('.confirm-message');
	const toggleButton = document.querySelector('.toggle-password');
	const toggleConfirmButton = document.querySelector('.toggle-password-confirm');

	// 비밀번호 보기/숨기기 토글 (기존 비밀번호)
	if (toggleButton && passwordInput) {
		toggleButton.addEventListener('click', function () {
			const type = passwordInput.getAttribute('type');
			const icon = toggleButton.querySelector('i');

			if (type === 'password') {
				passwordInput.setAttribute('type', 'text');
				icon.className = 'fa-solid fa-eye-slash';
			} else {
				passwordInput.setAttribute('type', 'password');
				icon.className = 'fa-solid fa-eye';
			}
		});
	}

	// 비밀번호 확인 보기/숨기기 토글
	if (toggleConfirmButton && confirmInput) {
		toggleConfirmButton.addEventListener('click', function () {
			const type = confirmInput.getAttribute('type');
			const icon = toggleConfirmButton.querySelector('i');

			if (type === 'password') {
				confirmInput.setAttribute('type', 'text');
				icon.className = 'fa-solid fa-eye-slash';
			} else {
				confirmInput.setAttribute('type', 'password');
				icon.className = 'fa-solid fa-eye';
			}
		});
	}

	// 비밀번호 유효성 검사
	if (passwordInput && messageElement) {
		passwordInput.addEventListener('input', function () {
			const password = this.value;

			// 조건 검사
			const hasLength = password.length >= 8 && password.length <= 20;
			const hasUpper = /[A-Z]/.test(password);
			const hasLower = /[a-z]/.test(password);
			const hasNumber = /[0-9]/.test(password);
			const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

			// 메시지 및 색상 설정
			let message = '';
			let color = '';

			if (!password) {
				message = '영문 대/소문자, 숫자, 특수문자 조합 8-20자';
				color = '#6c757d'; // 기본 회색
			} else if (!hasLength) {
				message = '8-20자 길이로 입력해주세요';
				color = '#dc3545'; // 빨간색
			} else if (!(hasUpper && hasLower && hasNumber && hasSpecial)) {
				message = '영문 대/소문자, 숫자, 특수문자를 모두 포함해주세요';
				color = '#ffc107'; // 노란색
			} else {
				message = '사용 가능한 비밀번호입니다';
				color = '#198754'; // 초록색
			}

			// 메시지 업데이트
			messageElement.textContent = message;
			messageElement.style.color = color;

			// 입력창 테두리 색상 변경
			passwordInput.style.borderColor = color;
		});

		// 포커스 아웃 시 기본 스타일로 복귀
		passwordInput.addEventListener('blur', function () {
			if (!this.value) {
				messageElement.style.color = '#6c757d';
				passwordInput.style.borderColor = '';
			}
		});
	}

	// 비밀번호 확인 일치 검사
	if (confirmInput && passwordInput) {
		function checkPasswordMatch() {
			const password = passwordInput.value;
			const confirmPassword = confirmInput.value;
			const confirmMessage = document.querySelector('.confirm-message');

			if (!confirmMessage) {
				console.warn('비밀번호 확인 메시지 요소를 찾을 수 없습니다.');
				return;
			}

			if (!confirmPassword) {
				confirmMessage.textContent = '비밀번호를 한번 더 입력해주세요';
				confirmMessage.style.color = '#6c757d'; // 기본 회색
				confirmInput.style.borderColor = '';
				return;
			}

			if (password === confirmPassword) {
				confirmMessage.textContent = '비밀번호가 일치합니다';
				confirmMessage.style.color = '#198754'; // 초록색
				confirmInput.style.borderColor = '#198754';
			} else {
				confirmMessage.textContent = '비밀번호가 일치하지 않습니다';
				confirmMessage.style.color = '#dc3545'; // 빨간색
				confirmInput.style.borderColor = '#dc3545';
			}
		}

		// 비밀번호 확인 입력 시에만 체크
		confirmInput.addEventListener('input', checkPasswordMatch);
		
		// 비밀번호 입력 시에는 비밀번호 확인 필드가 비어있지 않을 때만 체크
		passwordInput.addEventListener('input', function() {
			if (confirmInput.value) {
				checkPasswordMatch();
			}
		});
	}

	// 비밀번호 확인
	const passwordInputs = document.querySelectorAll('input[type="password"]');
	passwordInputs.forEach(input => {
		input.addEventListener('input', function() {
			// 비밀번호 확인 필드인 경우에만 처리
			if (this.id === 'userPwConfirm') {
				const password = document.getElementById('userPw').value;
				const confirmPassword = this.value;
				const message = this.parentElement.nextElementSibling;
				
				if (!confirmPassword) {
					message.textContent = '비밀번호를 한번 더 입력해주세요';
					message.style.color = '#6c757d';
					this.style.borderColor = '';
				} else if (password === confirmPassword) {
					message.textContent = '비밀번호가 일치합니다';
					message.style.color = '#198754';
					this.style.borderColor = '#198754';
				} else {
					message.textContent = '비밀번호가 일치하지 않습니다';
					message.style.color = '#dc3545';
					this.style.borderColor = '#dc3545';
				}
			}
		});
	});

	// 회원가입 폼 관련 요소
	const registerForm = document.getElementById('registerForm');
	const checkEmailBtn = document.getElementById('checkEmailBtn');
	const sendVerificationBtn = document.getElementById('sendVerificationBtn');
	const verifyCodeBtn = document.getElementById('verifyCodeBtn');

	// 이메일 중복 확인
	if (checkEmailBtn) {
		checkEmailBtn.addEventListener('click', function() {
			const email = document.getElementById('userEmail').value;
			
			if (!email) {
				Swal.fire({
					title: '알림',
					text: '이메일을 입력해주세요.',
					icon: 'warning',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
				return;
			}

			// 이메일 형식 검사
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				Swal.fire({
					title: '알림',
					text: '올바른 이메일 형식을 입력해주세요.',
					icon: 'warning',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
				return;
			}

			// TODO: 이메일 중복 확인 API 호출
			// 임시로 랜덤 결과 반환
			const isAvailable = Math.random() > 0.5;
			if (isAvailable) {
				Swal.fire({
					title: '사용 가능',
					text: '사용 가능한 이메일입니다.',
					icon: 'success',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
			} else {
				Swal.fire({
					title: '사용 불가',
					text: '이미 사용 중인 이메일입니다.',
					icon: 'error',
					confirmButtonText: '확인',
					confirmButtonColor: '#3085d6'
				});
			}
		});
	}

	// 인증번호 발송
	if (sendVerificationBtn) {
		sendVerificationBtn.addEventListener('click', function () {
			const phoneNumber = document.getElementById('userPhone').value.trim();
			
			// 전화번호 형식 검증
			const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
			if (!phoneRegex.test(phoneNumber)) {
				Swal.fire({
					title: '입력 오류',
					text: '올바른 전화번호 형식을 입력해주세요.',
					icon: 'error',
					confirmButtonText: '확인'
				});
				return;
			}

			// API 서버에 인증번호 발송 요청
			$.ajax({
				url: 'http://localhost:3000/api/send-verification',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({ phoneNumber }),
				success: function(response) {
					if (response.success) {
						Swal.fire({
							title: '인증번호 발송',
							text: response.message,
							icon: 'success',
							confirmButtonText: '확인'
						}).then((result) => {
							if (result.isConfirmed) {
								// 인증번호 입력 필드 활성화
								$('#phoneVerificationCode').prop('disabled', false);
								
								// 3분 타이머 시작
								startVerificationTimer();
							}
						});
					} else {
						Swal.fire({
							title: '발송 실패',
							text: response.message,
							icon: 'error',
							confirmButtonText: '확인'
						});
					}
				},
				error: function() {
					Swal.fire({
						title: '오류 발생',
						text: '서버 통신 중 오류가 발생했습니다.',
						icon: 'error',
						confirmButtonText: '확인'
					});
				}
			});
		});
	}

	// 인증번호 확인
	if (verifyCodeBtn) {
		verifyCodeBtn.addEventListener('click', function () {
			const phoneNumber = document.getElementById('userPhone').value.trim();
			const verificationCode = document.getElementById('verificationCode').value.trim();
			
			if (!verificationCode) {
				Swal.fire({
					title: '입력 오류',
					text: '인증번호를 입력해주세요.',
					icon: 'error',
					confirmButtonText: '확인'
				});
				return;
			}

			// 인증번호 확인 요청
			$.ajax({
				url: '/api/verify-code',  // 백엔드 API 엔드포인트
				method: 'POST',
				data: {
					phoneNumber: phoneNumber,
					code: verificationCode
				},
				success: function(response) {
					if (response.success) {
						Swal.fire({
							title: '인증 완료',
							text: '휴대폰 인증이 완료되었습니다.',
							icon: 'success',
							confirmButtonText: '확인'
						});
						
						// 인증 완료 상태 저장
						$('#userPhone').prop('readonly', true);
						$('#verificationCode').prop('readonly', true);
						$('#sendVerificationBtn').prop('disabled', true);
						$('#verifyCodeBtn').prop('disabled', true);
						
						// 타이머 중지
						stopVerificationTimer();
					} else {
						Swal.fire({
							title: '인증 실패',
							text: response.message || '인증번호가 일치하지 않습니다.',
							icon: 'error',
							confirmButtonText: '확인'
						});
					}
				},
				error: function() {
					Swal.fire({
						title: '오류 발생',
						text: '서버 통신 중 오류가 발생했습니다.',
						icon: 'error',
						confirmButtonText: '확인'
					});
				}
			});
		});
	}

	// 인증번호 입력 필드 초기 상태 설정
	$('#verificationCode').prop('disabled', true);
	$('#verifyCodeBtn').prop('disabled', true);

	// 인증 타이머 변수
	let verificationTimer;
	let timeLeft = 180; // 3분

	// 타이머 시작 함수
	function startVerificationTimer() {
		const timerDisplay = $('<div class="timer-display"></div>');
		$('.form-group:has(#verificationCode)').append(timerDisplay);
		
		verificationTimer = setInterval(function() {
			timeLeft--;
			const minutes = Math.floor(timeLeft / 60);
			const seconds = timeLeft % 60;
			timerDisplay.text(`남은 시간: ${minutes}:${seconds.toString().padStart(2, '0')}`);
			
			if (timeLeft <= 0) {
				stopVerificationTimer();
				Swal.fire({
					title: '시간 초과',
					text: '인증 시간이 만료되었습니다. 다시 시도해주세요.',
					icon: 'warning',
					confirmButtonText: '확인'
				});
			}
		}, 1000);
	}

	// 타이머 중지 함수
	function stopVerificationTimer() {
		clearInterval(verificationTimer);
		$('.timer-display').remove();
		timeLeft = 180;
	}

	// 회원가입 단계 관리
	let currentStep = 1;
	const totalSteps = 2;

	// 로그인 상태에 따른 네비게이션 메뉴 업데이트
	function updateNavigationMenu(isLoggedIn) {
		const navLinks = document.querySelector('.nav-links');
		if (navLinks) {
			if (isLoggedIn) {
				// 로그인 상태일 때
				navLinks.innerHTML = `
					<li><a href="../index.html">홈</a></li>
					<li><a href="../board/board.html">게시판</a></li>
					<li><a href="../inquiry/inquiry.html">문의하기</a></li>
					<li><a href="../notice/notice.html">공지사항</a></li>
					<li><a href="#" id="logoutBtn">로그아웃</a></li>
					<li><a href="./my-info.html">내정보</a></li>
				`;
			} else {
				// 로그아웃 상태일 때
				navLinks.innerHTML = `
					<li><a href="../index.html">홈</a></li>
					<li><a href="../board/board.html">게시판</a></li>
					<li><a href="../inquiry/inquiry.html">문의하기</a></li>
					<li><a href="../notice/notice.html">공지사항</a></li>
					<li><a href="./login.html">로그인</a></li>
				`;
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
	}

	// 페이지 로드 시 로그인 상태 확인 및 네비게이션 메뉴 업데이트
	document.addEventListener('DOMContentLoaded', function() {
		const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
		updateNavigationMenu(isLoggedIn);
	});

	// 프로필 이미지 변경 기능
	const profileImageInput = document.getElementById('profileImageInput');
	const profileImage = document.querySelector('.profile-image');

	if (profileImageInput && profileImage) {
		profileImageInput.addEventListener('change', function(e) {
			const file = e.target.files[0];
			if (file) {
				// 파일 크기 체크 (5MB 제한)
				if (file.size > 5 * 1024 * 1024) {
					Swal.fire({
						icon: 'error',
						title: '파일 크기 초과',
						text: '프로필 이미지는 5MB 이하만 가능합니다.',
						confirmButtonText: '확인',
						confirmButtonColor: '#3085d6'
					});
					return;
				}

				// 이미지 파일 형식 체크
				if (!file.type.startsWith('image/')) {
					Swal.fire({
						icon: 'error',
						title: '잘못된 파일 형식',
						text: '이미지 파일만 업로드 가능합니다.',
						confirmButtonText: '확인',
						confirmButtonColor: '#3085d6'
					});
					return;
				}

				const reader = new FileReader();
				reader.onload = function(e) {
					// 이미지 미리보기
					profileImage.src = e.target.result;

					// 이미지 업로드 확인
					Swal.fire({
						title: '프로필 이미지 변경',
						text: '프로필 이미지를 변경하시겠습니까?',
						icon: 'question',
						showCancelButton: true,
						confirmButtonText: '변경',
						cancelButtonText: '취소',
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33'
					}).then((result) => {
						if (result.isConfirmed) {
							// TODO: 서버에 이미지 업로드 로직 구현
							Swal.fire({
								icon: 'success',
								title: '변경 완료',
								text: '프로필 이미지가 변경되었습니다.',
								confirmButtonText: '확인',
								confirmButtonColor: '#3085d6'
							});
						} else {
							// 취소 시 원래 이미지로 복구
							profileImage.src = './images/profile/pro_02.png';
						}
					});
				};
				reader.readAsDataURL(file);
			}
		});
	}

	// 탭 전환 기능
	const tabButtons = document.querySelectorAll('.tab-button');
	const tabContents = document.querySelectorAll('.tab-content');

	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			// 모든 탭 버튼에서 active 클래스 제거
			tabButtons.forEach(btn => btn.classList.remove('active'));
			// 클릭된 버튼에 active 클래스 추가
			button.classList.add('active');

			// 모든 탭 콘텐츠 숨기기
			tabContents.forEach(content => content.classList.remove('active'));
			// 선택된 탭의 콘텐츠 표시
			const tabId = button.getAttribute('data-tab');
			document.getElementById(tabId).classList.add('active');
		});
	});

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

	// 폼 제출 처리
	const forms = {
		loginForm: document.getElementById('loginForm'),
		registerForm: document.getElementById('registerForm'),
		findIdForm: document.getElementById('findIdForm'),
		findPwForm: document.getElementById('findPwForm')
	};

	// 로그인 폼 제출
	forms.loginForm?.addEventListener('submit', function(e) {
		e.preventDefault();
		const email = document.getElementById('loginEmail').value;
		const password = document.getElementById('loginPw').value;
		
		// TODO: 로그인 API 호출
		console.log('로그인 시도:', { email, password });
	});

	// 회원가입 폼 제출
	forms.registerForm?.addEventListener('submit', function(e) {
		e.preventDefault();
		const formData = {
			email: document.getElementById('userEmail').value,
			password: document.getElementById('userPw').value,
			nickname: document.getElementById('userNickName').value,
			phone: document.getElementById('userPhone').value
		};
		
		// TODO: 회원가입 API 호출
		console.log('회원가입 시도:', formData);
	});

	// 아이디 찾기 폼 제출
	forms.findIdForm?.addEventListener('submit', function(e) {
		e.preventDefault();
		const formData = {
			name: document.getElementById('userName').value,
			phone: document.getElementById('userPhone').value
		};
		
		// TODO: 아이디 찾기 API 호출
		console.log('아이디 찾기 시도:', formData);
	});

	// 비밀번호 찾기 폼 제출
	forms.findPwForm?.addEventListener('submit', function(e) {
		e.preventDefault();
		const formData = {
			email: document.getElementById('userEmail').value,
			phone: document.getElementById('userPhone').value,
			newPassword: document.getElementById('userPw').value
		};
		
		// TODO: 비밀번호 찾기 API 호출
		console.log('비밀번호 찾기 시도:', formData);
	});
});

// 이용약관 열기
function openTerms(url) {
	window.open(url, '_blank', 'width=800,height=600');
}
