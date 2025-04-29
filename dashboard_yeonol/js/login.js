$(document).ready(function() {
	$('#logoutBtn').on('click', function(e) {
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
});

// 비밀번호 보기 토글
$('#togglePw').on('click', function() {
	const pwInput = $('#adminPw');
	const icon = $(this).find('i');
	if (pwInput.attr('type') === 'password') {
		pwInput.attr('type', 'text');
		icon.removeClass('icon-eye').addClass('icon-eye-blocked');
	} else {
		pwInput.attr('type', 'password');
		icon.removeClass('icon-eye-blocked').addClass('icon-eye');
	}
});

// reCAPTCHA 콜백 함수
function onRecaptchaSuccess(token) {
	console.log('reCAPTCHA verified');
}

document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM loaded'); // 디버깅용 로그

	// 필요한 DOM 요소들
	const elements = {
		form: document.getElementById('loginForm'),
		idInput: document.getElementById('adminId'),
		pwInput: document.getElementById('adminPw'),
		idCheckbox: document.getElementById('saveId'),
		pwCheckbox: document.getElementById('savePw'),
		socialButtons: document.querySelectorAll('.social-btn'),
		strengthMeter: document.getElementById('password-strength-meter'),
		togglePwBtn: document.getElementById('togglePw'),
		loginError: document.getElementById('loginError')
	};

	console.log('Elements loaded:', elements); // 디버깅용

	// 로그인 폼 제출
	if (elements.form) {
		elements.form.addEventListener('submit', function(e) {
			e.preventDefault();

			const adminId = elements.idInput.value;
			const adminPw = elements.pwInput.value;
			const recaptchaResponse = grecaptcha.getResponse();

			if (!recaptchaResponse) {
				Swal.fire({
					title: '알림',
					text: '캡차 인증을 완료해주세요.',
					icon: 'warning',
					confirmButtonText: '확인'
				});
				return;
			}

			// 로그인 검증
			if (adminId === 'admin' && adminPw === 'Ilmare2163*') {
				// 로그인 성공 시 아이디/비밀번호 저장 처리
				const saveId = elements.idCheckbox?.checked;
				const savePw = elements.pwCheckbox?.checked;
				
				if (saveId) {
					localStorage.setItem('savedId', adminId);
				} else {
					localStorage.removeItem('savedId');
				}
				
				if (savePw) {
					localStorage.setItem('savedPw', adminPw);
				} else {
					localStorage.removeItem('savedPw');
				}

				// 로그인 성공 메시지 표시 후 리다이렉트
				Swal.fire({
					title: '로그인 성공',
					text: '관리자 페이지로 이동합니다.',
					icon: 'success',
					confirmButtonText: '확인'
				}).then((result) => {
					if (result.isConfirmed) {
						window.location.href = 'index.html';
					}
				});
			} else {
				// 로그인 실패 시 에러 메시지 표시
				elements.loginError.style.display = 'block';
				Swal.fire({
					title: '로그인 실패',
					text: '아이디 또는 비밀번호를 확인하세요.',
					icon: 'error',
					confirmButtonText: '확인'
				});
				// 캡차 리셋
				grecaptcha.reset();
			}
		});
	}

	// 비밀번호 보기 토글
	if (elements.togglePwBtn && elements.pwInput) {
		elements.togglePwBtn.addEventListener('click', function() {
			const type = elements.pwInput.type === 'password' ? 'text' : 'password';
			elements.pwInput.type = type;
			const icon = this.querySelector('i');
			if (icon) {
				icon.className = type === 'password' ? 'icon-eye' : 'icon-eye-blocked';
			}
		});
	}

	// 저장된 로그인 정보 불러오기
	if (elements.idInput && elements.idCheckbox) {
		const savedId = localStorage.getItem('savedId');
		if (savedId) {
			elements.idInput.value = savedId;
			elements.idCheckbox.checked = true;
		}
	}

	if (elements.pwInput && elements.pwCheckbox) {
		const savedPw = localStorage.getItem('savedPw');
		if (savedPw) {
			elements.pwInput.value = savedPw;
			elements.pwCheckbox.checked = true;
		}
	}

	// 소셜 로그인 버튼 처리
	if (elements.socialButtons.length > 0) {
		elements.socialButtons.forEach(button => {
			button.addEventListener('click', function(e) {
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
		
		elements.pwInput.addEventListener('input', function() {
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
		toggleButton.addEventListener('click', function() {
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
		toggleConfirmButton.addEventListener('click', function() {
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

	// 비밀번호 확인 일치 검사
	if (confirmInput && passwordInput) {
		function checkPasswordMatch() {
			const password = passwordInput.value;
			const confirmPassword = confirmInput.value;

			if (!confirmPassword) {
				confirmMessage.textContent = '';
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

		confirmInput.addEventListener('input', checkPasswordMatch);
		passwordInput.addEventListener('input', function() {
			if (confirmInput.value) {
				checkPasswordMatch();
			}
		});
	}

	// 비밀번호 유효성 검사
	if (passwordInput && messageElement) {
		passwordInput.addEventListener('input', function() {
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
		passwordInput.addEventListener('blur', function() {
			if (!this.value) {
				messageElement.style.color = '#6c757d';
				passwordInput.style.borderColor = '';
			}
		});
	}

	// 회원가입 폼 제출 시 검증
	const registerForm = document.getElementById('registerForm');
	if (registerForm) {
		registerForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			const password = passwordInput.value;
			const confirmPassword = confirmInput.value;

			// 비밀번호 유효성 검사
			const isValid = (
				password.length >= 8 && 
				password.length <= 20 &&
				/[A-Z]/.test(password) &&
				/[a-z]/.test(password) &&
				/[0-9]/.test(password) &&
				/[!@#$%^&*(),.?":{}|<>]/.test(password)
			);

			// 비밀번호 일치 여부 검사
			const isMatch = password === confirmPassword;

			if (!isValid) {
				Swal.fire({
					title: '비밀번호 오류',
					text: '비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함한 8-20자여야 합니다.',
					icon: 'error',
					confirmButtonText: '확인'
				});
				return;
			}

			if (!isMatch) {
				Swal.fire({
					title: '비밀번호 불일치',
					text: '비밀번호가 일치하지 않습니다.',
					icon: 'error',
					confirmButtonText: '확인'
				});
				return;
			}

			// 여기에 추가적인 회원가입 로직 구현
		});
	}
});

// 캡챠 검증 함수 (서버 측 검증이 필요)
const verifyCaptcha = async (token) => {
	const secretKey = '6LccFSgrAAAAAJzg4u_O9y5vR92XmO-zQ2o0tpPa';
	try {
		const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `secret=${secretKey}&response=${token}`
		});
		return await response.json();
	} catch (error) {
		console.error('reCAPTCHA verification failed:', error);
		throw error;
	}
};

function openTerms(pageUrl) {
	// 화면 크기 계산
	const screenWidth = window.screen.width;
	const screenHeight = window.screen.height;
	
	// 창 크기를 화면의 60%로 설정
	const windowWidth = Math.floor(screenWidth * 0.6);
	const windowHeight = Math.floor(screenHeight * 0.6);
	
	// 창을 화면 중앙에 위치시키기 위한 좌표 계산
	const left = Math.floor((screenWidth - windowWidth) / 2);
	const top = Math.floor((screenHeight - windowHeight) / 2);
	
	// 새 창 열기
	const windowFeatures = `width=${windowWidth},height=${windowHeight},top=${top},left=${left},scrollbars=yes,resizable=yes`;
	window.open(pageUrl, '약관', windowFeatures);
}
