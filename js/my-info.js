$(document).ready(function() {
    // 초기 상태에서 비밀번호 변경 섹션 숨기기
    $('.password-section-content').hide();

    // 닉네임 기본값 설정
    $('#userNickName').val('터프가이');

    // 취소 버튼 클릭 이벤트
    $('.button-group .btn-secondary').on('click', function(e) {
        e.preventDefault();
        Swal.fire({
            title: '취소',
            text: '변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '취소하기',
            cancelButtonText: '돌아가기',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.html';
            }
        });
    });

    // 저장 버튼 클릭 이벤트
    $('.btn-primary').on('click', function(e) {
        e.preventDefault();
        
        // 닉네임 유효성 검사
        const nickname = $('#userNickName').val().trim();
        const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
        
        if (!nickname || !nicknameRegex.test(nickname)) {
            Swal.fire({
                title: '입력 오류',
                text: '올바른 닉네임을 입력해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
            return;
        }

        // 저장 확인 알림
        Swal.fire({
            title: '저장',
            text: '변경사항을 저장하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '저장하기',
            cancelButtonText: '취소',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                // 저장 성공 알림
                Swal.fire({
                    title: '저장 완료',
                    text: '변경사항이 성공적으로 저장되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                }).then(() => {
                    // 이전 페이지로 이동
                    window.history.back();
                });
            }
        });
    });

    // 닉네임 입력 필드 유효성 검사
    $('#userNickName').on('input', function() {
        const nickname = $(this).val().trim();
        const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/; // 한글, 영문, 숫자 2~10자

        if (!nickname) {
            $(this).css('borderColor', '#dc3545');
            $(this).siblings('.form-text').text('닉네임을 입력해주세요.').css('color', '#dc3545');
        } else if (!nicknameRegex.test(nickname)) {
            $(this).css('borderColor', '#dc3545');
            $(this).siblings('.form-text').text('닉네임은 2~10자의 한글, 영문, 숫자만 사용 가능합니다.').css('color', '#dc3545');
        } else {
            $(this).css('borderColor', '#198754');
            $(this).siblings('.form-text').text('사용 가능한 닉네임입니다.').css('color', '#198754');
        }
    });

    // 비밀번호 변경하기 버튼 클릭 이벤트
    $('.password-section-btn').on('click', function(e) {
        e.preventDefault();
        $('.password-section-content').slideToggle(300);
    });

    // 프로필 이미지 변경
    $('#profileImageInput').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크 (5MB 제한)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: '파일 크기 초과',
                    text: '프로필 이미지는 5MB 이하만 가능합니다.',
                    confirmButtonText: '확인'
                });
                return;
            }

            // 이미지 파일 형식 체크
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: '잘못된 파일 형식',
                    text: '이미지 파일만 업로드 가능합니다.',
                    confirmButtonText: '확인'
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                $('.profile-image').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 비밀번호 변경 폼 제출
    $('#changePasswordForm').on('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        // 현재 비밀번호 확인
        if (!currentPassword) {
            Swal.fire({
                title: '알림',
                text: '현재 비밀번호를 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        // 새 비밀번호 유효성 검사
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            Swal.fire({
                title: '알림',
                text: '비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 모두 포함해야 합니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        // 비밀번호 일치 검사
        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: '알림',
                text: '새 비밀번호가 일치하지 않습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        // 비밀번호 변경 성공 알림
        Swal.fire({
            title: '비밀번호 변경 완료',
            text: '비밀번호가 성공적으로 변경되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
        }).then((result) => {
            if (result.isConfirmed) {
                // 폼 초기화 및 비밀번호 섹션 숨기기
                $('#changePasswordForm')[0].reset();
                $('.password-section-content').hide();
            }
        });
    });

    // 회원 탈퇴 버튼 클릭 이벤트
    $('#withdrawBtn').on('click', function() {
        Swal.fire({
            title: '회원 탈퇴',
            text: '정말로 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '탈퇴',
            cancelButtonText: '취소',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                // 회원 탈퇴 처리
                Swal.fire({
                    title: '탈퇴 완료',
                    text: '회원 탈퇴가 완료되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                }).then(() => {
                    // 로그인 페이지로 이동
                    window.location.href = 'login.html';
                });
            }
        });
    });

    // 비밀번호 보기/숨기기 토글
    $('.toggle-password').on('click', function() {
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

    // 회원정보 수정 폼 제출
    $('#updateProfileForm').on('submit', function(e) {
        e.preventDefault();
        
        const userName = $('#userName').val();
        const userPhone = $('#userPhone').val();

        // 이름 검증
        if (!userName) {
            Swal.fire({
                title: '알림',
                text: '이름을 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        // 전화번호 형식 검증
        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (!phoneRegex.test(userPhone)) {
            Swal.fire({
                title: '알림',
                text: '올바른 전화번호 형식을 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        // 회원정보 수정 성공 알림
        Swal.fire({
            title: '수정 완료',
            text: '회원정보가 성공적으로 수정되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
        });
    });
}); 