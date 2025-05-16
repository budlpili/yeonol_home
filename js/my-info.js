$(document).ready(function() {
    // 초기 상태에서 비밀번호 변경 섹션 숨기기
    $('.password-section-content').hide();

    // 닉네임 기본값 설정
    $('#userNickName').val('터프가이');

    // 아이템 이용내역 버튼 클릭 이벤트
    $('#showItemHistory').on('click', function() {
        $('#mainInfoSection').hide();
        $('.my-info-card-02').hide();
        $('#itemHistorySection').show();
    });

    // 비밀번호 변경하기 버튼 클릭 이벤트
    $('#showPasswordChange').on('click', function() {
        $('#mainInfoSection').hide();
        $('.my-info-card-02').hide();
        $('#passwordChangeSection').show();
    });

    // 탈퇴하기 버튼 클릭 이벤트
    $('#showWithdrawal').on('click', function() {
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

    // 탭 기능 구현
    $('.tab-button').on('click', function() {
        // 모든 탭 버튼에서 active 클래스 제거
        $('.tab-button').removeClass('active');
        // 클릭된 버튼에 active 클래스 추가
        $(this).addClass('active');

        // 모든 탭 패널 숨기기
        $('.tab-pane').removeClass('active');
        // 선택된 탭 패널 표시
        const targetTab = $(this).data('tab');
        $('#' + targetTab).addClass('active');
    });

    // 초기 탭 상태 설정
    $('.tab-button:first').addClass('active');
    $('.tab-pane:first').addClass('active');

    // 비밀번호 변경 취소 버튼 클릭 이벤트
    $('#cancelPasswordChange').on('click', function() {
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
                $('#passwordChangeSection').hide();
                $('#mainInfoSection').show();
                $('.my-info-card-02').show();
                $('#passwordChangeForm')[0].reset();
            }
        });
    });

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

    // 보석 개수와 상태 값 스타일 설정 함수
    function setGemStyles() {
        $('.history-gem .gem-count').each(function() {
            const $gemCount = $(this);
            const $status = $gemCount.closest('tr').find('.history-status .gem-status');
            
            if ($gemCount.text().startsWith('-')) {
                $gemCount.css('color', '#ff4d4d');
                $status
                    .removeClass('charged')
                    .addClass('used')
                    .text('사용완료')
                    .css({
                        'background-color': '#fff1f1',
                        'color': '#ff4d4d',
                        'border': '1px solid #ff4d4d'
                    });
            } else {
                $gemCount.css('color', '#4a90e2');
                $status
                    .removeClass('used')
                    .addClass('charged')
                    .text('충전완료')
                    .css({
                        'background-color': '#f0f7ff',
                        'color': '#4a90e2',
                        'border': '1px solid #4a90e2'
                    });
            }
        });
    }

    // 아이템 내역 테이블 초기화
    const itemTable = $('#itemHistoryTable').DataTable({
        pageLength: 10,
        lengthChange: false,
        searching: true,
        ordering: true,
        info: true,
        paging: true,
        language: {
            info: "_START_부터 _END_까지 보기 (검색결과 총 _TOTAL_개)",
            infoEmpty: "검색 결과가 없습니다",
            emptyTable: "데이터가 없습니다",
            paginate: {
                first: "처음",
                last: "마지막",
                next: "다음",
                previous: "이전"
            }
        },
        order: [[0, 'desc']],
        drawCallback: function(settings) {
            setGemStyles();
            // 검색 결과 수 업데이트
            const total = this.api().data().length;
            const filtered = this.api().rows({ search: 'applied' }).count();
            const $countNumber = $('#usage .search-result-count .count-number');
            $countNumber.text(filtered);
        }
    });

    // 결제내역 테이블 초기화
    const paymentTable = $('#paymentHistoryTable').DataTable({
        pageLength: 10,
        lengthChange: false,
        searching: true,
        ordering: true,
        info: true,
        paging: true,
        language: {
            info: "_START_부터 _END_까지 보기 (검색결과 총 _TOTAL_개)",
            infoEmpty: "검색 결과가 없습니다",
            emptyTable: "데이터가 없습니다",
            paginate: {
                first: "처음",
                last: "마지막",
                next: "다음",
                previous: "이전"
            }
        },
        order: [[0, 'desc']],
        drawCallback: function(settings) {
            // 검색 결과 수 업데이트
            const total = this.api().data().length;
            const filtered = this.api().rows({ search: 'applied' }).count();
            const $countNumber = $('#payment .search-result-count .count-number');
            $countNumber.text(filtered);
        }
    });

    // 날짜 필터링 함수
    function filterTableByDate(table, startDate, endDate) {
        table.draw();
        
        // 기존 필터 제거
        $.fn.dataTable.ext.search.pop();
        
        // 새로운 필터 추가
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            const row = table.row(dataIndex).node();
            const dateText = $(row).find('.date-text').text();
            const timeText = $(row).find('.time-text').text();
            const rowDate = new Date(dateText + ' ' + timeText);
            
            return (!startDate || rowDate >= startDate) && 
                   (!endDate || rowDate <= endDate);
        });
        
        table.draw();
        
        // 검색 결과 수 업데이트
        const filtered = table.rows({ search: 'applied' }).count();
        const $countNumber = table.table().node().id === 'itemHistoryTable' ? 
            $('#usage .search-result-count .count-number') : 
            $('#payment .search-result-count .count-number');
        $countNumber.text(filtered);
    }

    // 날짜 범위 설정 함수
    function setDateRange(days) {
        const today = new Date();
        const startDate = new Date(today);
        const endDate = new Date(today);

        endDate.setHours(23, 59, 59, 999);

        switch(days) {
            case 1: // 오늘
                startDate.setHours(0, 0, 0, 0);
                break;
            case 7: // 일주일
                startDate.setDate(today.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 30: // 한달
                startDate.setMonth(today.getMonth() - 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            default: // 전체
                return { startDate: null, endDate: null };
        }

        return { startDate, endDate };
    }

    // 날짜 포맷 함수
    function formatDate(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 날짜 버튼 클릭 이벤트 처리
    $('.tab-content').on('click', '.date-btn', function() {
        const $tabPane = $(this).closest('.tab-pane');
        const table = $tabPane.attr('id') === 'usage' ? itemTable : paymentTable;
        const $dateInputs = $tabPane.find('.date-input');
        
        // 버튼 활성화 상태 변경
        $tabPane.find('.date-btn').removeClass('active');
        $(this).addClass('active');

        const days = $(this).data('days');
        
        if (days === 'custom') {
            $dateInputs.prop('disabled', false);
            $dateInputs.first().val('');
            const today = new Date();
            $dateInputs.last().val(formatDate(today));
            
            // 필터 초기화
            $.fn.dataTable.ext.search.pop();
            table.draw();
        } else {
            $dateInputs.prop('disabled', true);
            const { startDate, endDate } = setDateRange(days);
            
            if (startDate) {
                $dateInputs.first().val(formatDate(startDate));
                $dateInputs.last().val(formatDate(endDate));
            }
            
            filterTableByDate(table, startDate, endDate);
        }
    });

    // 날짜 검색 버튼 클릭 이벤트 처리
    $('.tab-content').on('click', '.date-search-btn', function() {
        const $tabPane = $(this).closest('.tab-pane');
        const table = $tabPane.attr('id') === 'usage' ? itemTable : paymentTable;
        
        const startDateStr = $tabPane.find('.date-input').first().val();
        const endDateStr = $tabPane.find('.date-input').last().val();
        
        if (!startDateStr || !endDateStr) {
            alert('시작일과 종료일을 모두 선택해주세요.');
            return;
        }

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        if (startDate > endDate) {
            alert('시작일이 종료일보다 늦을 수 없습니다.');
            return;
        }

        filterTableByDate(table, startDate, endDate);
    });

    // 탭 전환 시 필터 초기화
    $('.tab-button').on('click', function() {
        const tabId = $(this).data('tab');
        const table = tabId === 'usage' ? itemTable : paymentTable;
        
        // 필터 초기화
        $.fn.dataTable.ext.search.pop();
        table.draw();
        
        // 버튼 상태 초기화
        $(`#${tabId} .date-btn`).removeClass('active');
        $(`#${tabId} .date-btn[data-days="all"]`).addClass('active');
        
        // 날짜 입력 필드 초기화
        $(`#${tabId} .date-input`).prop('disabled', true).val('');
    });

    // 초기 설정
    $('.date-btn[data-days="all"]').click();

    // CSS 스타일 추가
    $('<style>')
        .text(`
            .search-result-count {
                margin: 10px 0;
                color: #666;
                font-size: 14px;
                font-weight: bold;
            }
            .dataTables_info {
                margin-top: 10px;
                color: #666;
                font-size: 14px;
            }
        `)
        .appendTo('head');

    // 오늘 날짜를 종료일로 설정
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 날짜 입력 필드 기본값 설정
    $('#startDate').val(formatDate(oneMonthAgo));
    $('#endDate').val(formatDate(today));

    // 초기 검색 결과 수 설정
    $('#usage .search-result-count .count-number').text(itemTable.data().length);
    $('#payment .search-result-count .count-number').text(paymentTable.data().length);

    // 초기 스타일 설정
    setGemStyles();
}); 