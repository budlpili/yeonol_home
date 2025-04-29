class NotificationManager {
    constructor() {
        this.selectedUsers = new Set();
        this.initializeDataTables();
        this.initializeEventHandlers();
        this.initializeDateRangePicker();
        this.initializeModal();
    }

    initializeDataTables() {
        // DataTable 초기화 전에 테이블이 보이도록 설정
        $('#history').addClass('show');
        
        this.notificationTable = $('#notificationHistoryTable').DataTable({
            language: {
                "emptyTable": "발송 내역이 없습니다",
			          "info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                "lengthMenu": "_MENU_ 개씩보기",
                "infoEmpty": "데이터가 없습니다",
                "infoFiltered": "(전체 _MAX_ 건 중 검색결과)",
                "search": "검색:",
                "zeroRecords": "검색된 데이터가 없습니다.",
                "paginate": {
                    "first": "«",
                    "last": "»",
                    "next": "›",
                    "previous": "‹"
                },
                "lengthMenu": "_MENU_ 개씩보기"
            },
            order: [[4, 'desc']], // 발송일시 기준 내림차순
            columns: [
                { data: 'id' },
                { 
                    data: 'type',
                    render: (data) => this.getNotificationTypeBadge(data)
                },
                { data: 'title' },
                { data: 'target' },
                { data: 'sendDate' },
                { 
                    data: 'status',
                    render: (data) => this.getStatusBadge(data)
                },
                {
                    data: null,
                    render: (data) => this.getActionButtons(data)
                }
            ]
        });

        // 샘플 데이터 추가
        this.addSampleData();

        // 초기화 후 첫 번째 탭으로 돌아가기
        $('#history').removeClass('show');
        $('#send').addClass('show active');
    }

    addSampleData() {
        const sampleData = [
            {
                id: 'NOTI001',
                type: 'event',
                title: '신규 이벤트 안내',
                content: '안녕하세요!\n새로운 이벤트가 시작되었습니다.\n\n참여 방법:\n1. 앱 실행하기\n2. 이벤트 페이지 방문\n3. 참여하기 버튼 클릭\n\n많은 참여 부탁드립니다!',
                target: '전체 회원 (1000명)',
                sendDate: '2024-03-15 10:00:00',
                status: 'SUCCESS'
            },
            {
                id: 'NOTI002',
                type: 'urgent',
                title: '긴급 점검 안내',
                content: '서버 긴급 점검 안내\n\n일시: 2024-03-14 16:00 ~ 17:00\n영향: 전체 서비스\n사유: 보안 업데이트\n\n불편을 끼쳐 죄송합니다.',
                target: '활성 회원 (800명)',
                sendDate: '2024-03-14 15:30:00',
                status: 'FAILED'
            },
            {
                id: 'NOTI003',
                type: 'general',
                title: '서비스 업데이트 안내',
                content: '서비스 업데이트 안내입니다.\n\n적용 버전: v2.34\n업데이트 내용:\n- 새로운 기능 추가\n- 버그 수정\n- 성능 개선',
                target: '전체 회원 (1000명)',
                sendDate: '2024-03-13 09:00:00',
                status: 'SUCCESS'
            }
        ];

        sampleData.forEach(data => {
            this.notificationTable.row.add(data);
        });
        this.notificationTable.draw();
    }

    initializeEventHandlers() {
        // 알림 유형 변경 이벤트
        $('#notificationType').on('change', (e) => {
            this.updatePreview();
            this.updateNotificationTypeUI($(e.target).val());
        });

        // 발송 대상 선택 이벤트
        $('#targetType').on('change', (e) => {
            const targetType = $(e.target).val();
            $('#customSelection').toggle(targetType === 'CUSTOM');
            this.updateSendButtonState();
        });

        // 사용자 검색 이벤트
        $('#userSearch').on('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchUsers();
            }
        });
        $('#searchBtn').on('click', () => this.searchUsers());

        // 실시간 미리보기 업데이트
        $('#notificationTitle, #notificationContent').on('input', () => this.updatePreview());

        // 알림 발송 폼 제출
        $('#notificationForm').on('submit', (e) => {
            e.preventDefault();
            this.confirmAndSendNotification();
        });

        // 탭 변경 이벤트 수정
        $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            const targetTab = $(e.target).attr('href');
            if (targetTab === '#history') {
                // history 탭이 표시될 때 테이블 리사이즈
                if (this.notificationTable) {
                    this.notificationTable.columns.adjust();
                }
            }
            // 탭 내용 표시
            $(targetTab).addClass('show active');
        });

        // 빠른 필터 버튼 이벤트
        $('.date-quick-filters .btn').on('click', (e) => {
            const period = $(e.target).data('period');
            this.updateDateRange(period);
        });

        // 테이블의 상세보기 버튼 클릭 이벤트
        $('#notificationHistoryTable').on('click', '.btn-view', (e) => {
            e.preventDefault();
            const rowData = this.notificationTable.row($(e.target).closest('tr')).data();
            this.viewNotificationDetail(rowData);
        });

        // 테이블의 재발송 버튼 클릭 이벤트
        $('#notificationHistoryTable').on('click', '.btn-resend', (e) => {
            e.preventDefault();
            const rowData = this.notificationTable.row($(e.target).closest('tr')).data();
            this.resendNotification(rowData);
        });

        // 모달 닫기 버튼 이벤트
        document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
            button.addEventListener('click', () => {
                this.modal.hide();
            });
        });
    }

    initializeDateRangePicker() {
        const start = moment().subtract(7, 'days');
        const end = moment();

        $('#historyDateRange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                '오늘': [moment(), moment()],
                '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '최근 7일': [moment().subtract(6, 'days'), moment()],
                '최근 30일': [moment().subtract(29, 'days'), moment()],
                '이번 달': [moment().startOf('month'), moment().endOf('month')],
                '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            locale: {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                applyLabel: '적용',
                cancelLabel: '취소',
                fromLabel: '시작일',
                toLabel: '종료일',
                customRangeLabel: '직접 설정',
                weekLabel: 'W',
                daysOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
                monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
            }
        }, (start, end) => {
            this.filterTableByDate(start, end);
        });

        this.filterTableByDate(start, end);
    }

    updateDateRange(period) {
        let start, end;
        
        switch(period) {
            case 'today':
                start = moment().startOf('day');
                end = moment().endOf('day');
                break;
            case 'week':
                start = moment().subtract(6, 'days').startOf('day');
                end = moment().endOf('day');
                break;
            case 'month':
                start = moment().subtract(1, 'month').startOf('day');
                end = moment().endOf('day');
                break;
            case '3months':
                start = moment().subtract(3, 'months').startOf('day');
                end = moment().endOf('day');
                break;
        }

        $('#historyDateRange').data('daterangepicker').setStartDate(start);
        $('#historyDateRange').data('daterangepicker').setEndDate(end);
    }

    filterTableByDate(start, end) {
        $.fn.dataTable.ext.search.push((settings, data) => {
            const sendDate = moment(data[4], 'YYYY-MM-DD HH:mm:ss');
            return sendDate.isBetween(start, end, 'day', '[]');
        });

        this.notificationTable.draw();
        $.fn.dataTable.ext.search.pop();
    }

    searchUsers() {
        const searchTerm = $('#userSearch').val();
        if (!searchTerm) {
            alert('검색어를 입력해주세요.');
            return;
        }

        // 실제 구현에서는 API 호출로 대체
        const mockUsers = [
            { id: 'USER1', nickname: '사용자1', profileImage: 'img/user1.png' },
            { id: 'USER2', nickname: '사용자2', profileImage: 'img/user2.png' },
            { id: 'USER3', nickname: '사용자3', profileImage: 'img/user3.png' }
        ];

        const resultsHtml = mockUsers.map(user => `
            <div class="search-result-item p-2 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="user-img-sm mr-2">
                            <img src="${user.profileImage}" alt="User" class="rounded-circle" width="32" height="32">
                        </div>
                        <div>
                            <div class="user-name">${user.nickname}</div>
                            <div class="user-id text-muted small">${user.id}</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary add-user" 
                            onclick="notificationManager.addSelectedUser('${user.id}', '${user.nickname}')">
                        <i class="icon-plus"></i> 추가
                    </button>
                </div>
            </div>
        `).join('');

        $('#searchResults').html(resultsHtml);
    }

    addSelectedUser(userId, nickname) {
        if (!this.selectedUsers.has(userId)) {
            this.selectedUsers.add(userId);
            const userElement = `
                <div class="selected-user-item" id="selected-user-${userId}">
                    <div class="d-flex align-items-center">
                        <div class="user-img-sm mr-2">
                            <img src="img/user-default.png" alt="User" class="rounded-circle" width="32" height="32">
                        </div>
                        <div>
                            <div class="user-name">${nickname}</div>
                            <div class="user-id text-muted small">${userId}</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger" 
                            onclick="notificationManager.removeSelectedUser('${userId}')">
                        <i class="icon-trash"></i>
                    </button>
                </div>
            `;
            $('#selectedUsers').append(userElement);
            this.updateSelectedUserCount();
        }
    }

    removeSelectedUser(userId) {
        if (this.selectedUsers.has(userId)) {
            this.selectedUsers.delete(userId);
            $(`#selected-user-${userId}`).remove();
            this.updateSelectedUserCount();
        }
    }

    updateSelectedUserCount() {
        $('#selectedUserCount').text(this.selectedUsers.size);
        this.updateSendButtonState();
    }

    updateSendButtonState() {
        const targetType = $('#targetType').val();
        const isCustomTarget = targetType === 'CUSTOM';
        const hasSelectedUsers = this.selectedUsers.size > 0;
        
        $('#sendBtn').prop('disabled', 
            isCustomTarget && !hasSelectedUsers || !targetType
        );
    }

    updatePreview() {
        const type = $('#notificationType').val();
        const title = $('#notificationTitle').val();
        const content = $('#notificationContent').val();
        
        this.updateNotificationTypeUI(type);
        $('#previewTitle').text(title || '제목을 입력하세요');
        $('#previewContent').text(content || '내용을 입력하세요');
    }

    updateNotificationTypeUI(type) {
        const typeConfigs = {
            'general': { text: '일반 알림', icon: 'icon-bell' },
            'event': { text: '이벤트 알림', icon: 'icon-gift' },
            'urgent': { text: '긴급 알림', icon: 'icon-alert-triangle' },
            'notice': { text: '공지사항', icon: 'icon-info' }
        };

        const config = typeConfigs[type] || { text: '알림 유형', icon: 'icon-bell' };
        $('#previewType').attr('class', `notification-type-badge ${type}`)
            .html(`<i class="${config.icon}"></i> ${config.text}`);
    }

    getNotificationTypeBadge(type) {
        const types = {
            'general': ['일반 알림', 'general', 'icon-bell'],
            'event': ['이벤트 알림', 'event', 'icon-gift'],
            'urgent': ['긴급 알림', 'urgent', 'icon-alert-triangle'],
            'notice': ['공지사항', 'notice', 'icon-info']
        };
        const [text, className, icon] = types[type] || ['알 수 없음', 'general', 'icon-bell'];
        return `<span class="notification-type-badge ${className}"><i class="${icon}"></i> ${text}</span>`;
    }

    getStatusBadge(status) {
        const badges = {
            'SUCCESS': '<span class="badge badge-success">발송완료</span>',
            'FAILED': '<span class="badge badge-danger">발송실패</span>',
            'PENDING': '<span class="badge badge-warning">발송중</span>'
        };
        return badges[status] || badges.FAILED;
    }

    getActionButtons(data) {
        return `
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-info btn-view">
                    <i class="icon-eye"></i>
                </button>
                <button type="button" class="btn btn-sm btn-secondary btn-resend" ${data.status === 'SUCCESS' ? 'disabled' : ''}>
                    <i class="icon-refresh-ccw"></i>
                </button>
            </div>
        `;
    }

    async confirmAndSendNotification() {
        const formData = this.getFormData();
        
        if (!this.validateNotificationData(formData)) {
            return;
        }

        const targetCount = this.getTargetUserCount(formData.targetType);
        const confirmMessage = this.getConfirmMessage(formData, targetCount);

        if (confirm(confirmMessage)) {
            await this.sendNotification(formData);
        }
    }

    getFormData() {
        return {
            type: $('#notificationType').val(),
            targetType: $('#targetType').val(),
            title: $('#notificationTitle').val().trim(),
            content: $('#notificationContent').val().trim(),
            selectedUsers: Array.from(this.selectedUsers)
        };
    }

    validateNotificationData(data) {
        if (!data.type) {
            alert('알림 유형을 선택해주세요.');
            return false;
        }
        if (!data.targetType) {
            alert('발송 대상을 선택해주세요.');
            return false;
        }
        if (data.targetType === 'CUSTOM' && data.selectedUsers.length === 0) {
            alert('발송할 사용자를 선택해주세요.');
            return false;
        }
        if (!data.title) {
            alert('알림 제목을 입력해주세요.');
            return false;
        }
        if (!data.content) {
            alert('알림 내용을 입력해주세요.');
            return false;
        }
        return true;
    }

    getTargetUserCount(targetType) {
        const mockCounts = {
            'ALL': 1000,
            'ACTIVE': 800,
            'INACTIVE': 200,
            'CUSTOM': this.selectedUsers.size
        };
        return mockCounts[targetType] || 0;
    }

    getConfirmMessage(formData, targetCount) {
        const typeText = this.getNotificationTypeText(formData.type);
        const targetText = this.getTargetText(formData.targetType, targetCount);
        return `${typeText}을(를) ${targetText}에게 발송하시겠습니까?\n\n제목: ${formData.title}`;
    }

    getNotificationTypeText(type) {
        const types = {
            'general': '일반 알림',
            'event': '이벤트 알림',
            'urgent': '긴급 알림',
            'notice': '공지사항'
        };
        return types[type] || '알림';
    }

    getTargetText(targetType, count) {
        const types = {
            'ALL': '전체 회원',
            'NEW': '신규 가입자',
            'INACTIVE': '휴면 회원',
            'GRADE': '특정 등급 회원',
            'CUSTOM': '선택된 회원'
        };
        return `${types[targetType]} (${count}명)`;
    }

    async sendNotification(formData) {
        try {
            $('#sendBtn').prop('disabled', true).html('<i class="icon-loader"></i> 발송중...');

            // 실제 구현에서는 API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 발송 내역 테이블에 추가
            const newNotification = {
                id: 'NOTI' + Date.now(),
                type: formData.type,
                title: formData.title,
                content: formData.content,
                target: this.getTargetText(formData.targetType, this.getTargetUserCount(formData.targetType)),
                sendDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 'SUCCESS'
            };

            this.notificationTable.row.add(newNotification).draw();

            // 성공 알림창 내용 개선
            const typeText = this.getNotificationTypeText(formData.type);
            const message = `
                <div class="notification-success">
                    <div class="success-header">
                        <i class="icon-check-circle text-success"></i>
                        <strong>${typeText} 발송 완료</strong>
                    </div>
                    <div class="success-content mt-3">
                        <div class="mb-2">
                            <strong>제목:</strong> ${formData.title}
                        </div>
                        <div class="mb-2">
                            <strong>내용:</strong><br>
                            <div class="content-preview">${formData.content.replace(/\n/g, '<br>')}</div>
                        </div>
                        <div>
                            <strong>발송대상:</strong> ${this.getTargetText(formData.targetType, this.getTargetUserCount(formData.targetType))}
                        </div>
                    </div>
                </div>
            `;

            // 기존 알림창이 있다면 제거
            const existingAlert = document.querySelector('.notification-alert');
            if (existingAlert) {
                document.body.removeChild(existingAlert);
            }

            // 새 알림창 생성
            const alertDiv = document.createElement('div');
            alertDiv.className = 'notification-alert';
            alertDiv.innerHTML = message;
            alertDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 9999;
                max-width: 400px;
                width: 90%;
            `;

            // 닫기 버튼 추가
            const closeButton = document.createElement('button');
            closeButton.textContent = '확인';
            closeButton.className = 'btn btn-primary mt-3 w-100';
            closeButton.onclick = () => {
                document.body.removeChild(alertDiv);
                this.resetForm();
            };
            alertDiv.appendChild(closeButton);

            // 스타일 추가
            if (!document.querySelector('#notification-alert-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-alert-styles';
                style.textContent = `
                    .notification-success {
                        font-size: 14px;
                    }
                    .success-header {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-size: 18px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #dee2e6;
                    }
                    .success-content {
                        color: #495057;
                    }
                    .content-preview {
                        background: #f8f9fa;
                        padding: 10px;
                        border-radius: 4px;
                        margin-top: 5px;
                        white-space: pre-line;
                        max-height: 150px;
                        overflow-y: auto;
                    }
                    .notification-alert {
                        animation: fadeIn 0.3s ease-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translate(-50%, -48%); }
                        to { opacity: 1; transform: translate(-50%, -50%); }
                    }
                `;
                document.head.appendChild(style);
            }

            // 알림창 표시
            document.body.appendChild(alertDiv);

        } catch (error) {
            console.error('Error sending notification:', error);
            alert('알림 발송 중 오류가 발생했습니다.');
        } finally {
            $('#sendBtn').prop('disabled', false).html('<i class="icon-send"></i> 알림 발송');
        }
    }

    resetForm() {
        // 폼 초기화 로직 구현
    }

    initializeModal() {
        const modalEl = document.getElementById('notificationDetailModal');
        if (!modalEl) return;

        // Bootstrap 모달 초기화
        this.modal = new bootstrap.Modal(modalEl);

        // 모달이 열리기 전 이벤트
        modalEl.addEventListener('show.bs.modal', () => {
            // 모달이 열릴 때 aria-hidden 제거
            modalEl.removeAttribute('aria-hidden');
            // 모달에 aria-modal 추가
            modalEl.setAttribute('aria-modal', 'true');
            // 페이지 컨텐츠에 aria-hidden 추가
            document.querySelector('main')?.setAttribute('aria-hidden', 'true');
        });

        // 모달이 열린 후 이벤트
        modalEl.addEventListener('shown.bs.modal', () => {
            // 닫기 버튼에 포커스
            const closeButton = modalEl.querySelector('.btn-close');
            if (closeButton) {
                closeButton.focus();
            }
        });

        // 모달이 닫히기 전 이벤트
        modalEl.addEventListener('hide.bs.modal', () => {
            // 페이지 컨텐츠의 aria-hidden 제거
            document.querySelector('main')?.removeAttribute('aria-hidden');
        });

        // 모달이 닫힌 후 이벤트
        modalEl.addEventListener('hidden.bs.modal', () => {
            // 마지막으로 포커스된 요소로 돌아가기
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
            }
            // 모달 내용 초기화
            modalEl.querySelector('.notification-content').textContent = '';
        });

        // 포커스 트랩 설정
        modalEl.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modalEl.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                // Shift + Tab
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                }
                // Tab
                else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            // ESC 키 처리
            else if (e.key === 'Escape') {
                this.modal.hide();
            }
        });
    }

    viewNotificationDetail(data) {
        // 현재 포커스된 요소 저장
        this.lastFocusedElement = document.activeElement;

        const modalEl = document.getElementById('notificationDetailModal');
        if (!modalEl) return;

        try {
            // 모달 내용 업데이트
            const elements = {
                id: modalEl.querySelector('.notification-id'),
                type: modalEl.querySelector('.notification-type'),
                title: modalEl.querySelector('.notification-title'),
                content: modalEl.querySelector('.notification-content'),
                target: modalEl.querySelector('.notification-target'),
                date: modalEl.querySelector('.notification-date'),
                status: modalEl.querySelector('.notification-status')
            };

            // 모달 내용 업데이트
            elements.id.textContent = `발송번호: ${data.id}`;
            elements.type.innerHTML = this.getNotificationTypeBadge(data.type);
            elements.title.textContent = data.title;
            elements.content.textContent = data.content || '알림 내용이 없습니다.';
            elements.target.textContent = data.target;
            elements.date.textContent = data.sendDate;
            elements.status.innerHTML = this.getStatusBadge(data.status);

            // 재발송 버튼 설정
            const resendBtn = modalEl.querySelector('.resend-btn');
            if (resendBtn) {
                if (data.status === 'SUCCESS') {
                    resendBtn.style.display = 'none';
                } else {
                    resendBtn.style.display = 'inline-block';
                    resendBtn.onclick = () => {
                        this.modal.hide();
                        this.resendNotification(data);
                    };
                }
            }

            // 모달 표시
            this.modal.show();

        } catch (error) {
            console.error('Error updating modal content:', error);
            alert('알림 상세 정보를 표시하는 중 오류가 발생했습니다.');
        }
    }

    resendNotification(rowData) {
        // 테이블의 재발송 로직 구현
    }
}

// 페이지 로드 시 NotificationManager 인스턴스 생성
let notificationManager;
$(document).ready(() => {
    notificationManager = new NotificationManager();
});
 