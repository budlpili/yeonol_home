class ReportManager {
    constructor() {
        this.sampleData = this.createSampleData();
        this.initializeDataTables();
        this.initializeDateRangePicker();
        this.initializeModal();
        this.addEventListeners();
    }

    createSampleData() {
        return [
            {
                id: 1,
                type: 'SPAM',
                reporter: {
                    id: 'user123',
                    nickname: '신고자1',
                    email: 'reporter1@example.com',
                    reportCount: 5,
                    profileImage: 'img/user21.png'
                },
                reportedContent: {
                    type: 'COMMENT',
                    id: 'comment123',
                    preview: '부적절한 광고 내용입니다...',
                    author: {
                        id: 'spammer456',
                        nickname: '스팸계정',
                        email: 'spammer@example.com',
                        profileImage: 'img/user10.png'
                    }
                },
                reportDate: '2024-03-15T14:30:00',
                status: 'PENDING',
                reason: '무분별한 광고성 댓글을 계속 작성하고 있습니다.'
            },
            {
                id: 2,
                type: 'HARASSMENT',
                reporter: {
                    id: 'user456',
                    nickname: '신고자2',
                    email: 'reporter2@example.com',
                    reportCount: 3,
                    profileImage: 'img/user6.png'
                },
                reportedContent: {
                    type: 'POST',
                    id: 'post789',
                    preview: '욕설이 포함된 게시글...',
                    author: {
                        id: 'baduser789',
                        nickname: '불량이용자',
                        email: 'baduser@example.com',
                        profileImage: 'img/user4.png'
                    }
                },
                reportDate: '2024-03-14T09:15:00',
                status: 'PROCESSED',
                reason: '심한 욕설과 비방이 포함된 게시글입니다.'
            },
            {
                id: 3,
                type: 'INAPPROPRIATE',
                reporter: {
                    id: 'user789',
                    nickname: '신고자3',
                    email: 'reporter3@example.com',
                    reportCount: 1,
                    profileImage: 'img/user5.png'
                },
                reportedContent: {
                    type: 'REVIEW',
                    id: 'review456',
                    preview: '부적절한 내용의 리뷰...',
                    author: {
                        id: 'user999',
                        nickname: '문제유저',
                        email: 'problematic@example.com',
                        profileImage: 'img/user8.png'
                    }
                },
                reportDate: '2024-03-13T16:45:00',
                status: 'REJECTED',
                reason: '부적절한 내용이 포함된 리뷰입니다.'
            }
        ];
    }

    initializeDataTables() {
        this.reportTable = $('#reportTable').DataTable({
            data: this.sampleData,
            scrollX: false,
            autoWidth: true,
            columns: [
                { data: 'id', width: '5%' },
                { 
                    data: 'type',
                    width: '10%',
                    render: (data) => this.getReportTypeBadge(data)
                },
                { 
                    data: 'reporter',
                    width: '15%',
                    render: (data) => this.getUserInfo(data)
                },
                { 
                    data: 'reportedContent',
                    width: '25%',
                    render: (data) => this.getReportedContentInfo(data)
                },
                { 
                    data: 'reportDate',
                    width: '15%',
                    render: (data) => moment(data).format('YYYY-MM-DD HH:mm')
                },
                { 
                    data: 'status',
                    width: '13%',
                    render: (data) => this.getStatusBadge(data)
                },
                {
                    data: 'id',
                    width: '15%',
                    render: (data) => `
                        <button type="button" class="btn btn-sm btn-primary view-detail" data-report-id="${data}">
                            상세보기
                        </button>
                    `
                }
            ],
            order: [[4, 'desc']],
            language: {
                "emptyTable": "신고 내역이 없습니다",
                "info": "현재 _START_ - _END_ / 총 _TOTAL_건",
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
            }
        });
    }

    initializeModal() {
        const modalElement = document.getElementById('reportDetailModal');
        
        // Bootstrap 모달 인스턴스 생성
        this.modal = new bootstrap.Modal(modalElement, {
            keyboard: true,
            backdrop: true
        });

        // 닫기 버튼 이벤트 리스너 추가
        const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.modal.hide();
            });
        });

        // ESC 키 이벤트 처리
        modalElement.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.modal.hide();
            }
        });

        // 모달이 닫힐 때 이벤트
        modalElement.addEventListener('hidden.bs.modal', () => {
            // 모달이 닫힐 때 필요한 정리 작업
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.inert = false;
            }
        });
    }

    addEventListeners() {
        // 상세보기 버튼 클릭 이벤트
        $('#reportTable tbody').on('click', '.view-detail', (e) => {
            const reportId = parseInt($(e.currentTarget).data('report-id'));
            this.viewReportDetail(reportId);
        });

        // 모달 내 버튼들의 이벤트
        const modalElement = document.getElementById('reportDetailModal');
        
        // 경고 버튼
        modalElement.querySelector('#warnButton')?.addEventListener('click', () => {
            this.handleWarnUser();
        });

        // 차단 버튼
        modalElement.querySelector('#blockButton')?.addEventListener('click', () => {
            this.handleBlockUser();
        });

        // 삭제 버튼
        modalElement.querySelector('#deleteButton')?.addEventListener('click', () => {
            this.handleDeleteContent();
        });
    }

    viewReportDetail(reportId) {
        const report = this.sampleData.find(r => r.id === reportId);
        if (!report) {
            console.error('Report not found:', reportId);
            return;
        }

        const modalElement = document.getElementById('reportDetailModal');
        if (!modalElement) {
            console.error('Modal element not found');
            return;
        }

        // 모달 내용 설정
        this.setModalData(report);

        // 모달 표시
        this.modal.show();

        // 메인 콘텐츠 비활성화
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.inert = true;
        }
    }

    getReportTypeBadge(type) {
        const types = {
            'SPAM': { text: '스팸', class: 'bg-warning' },
            'HARASSMENT': { text: '괴롭힘', class: 'bg-danger' },
            'INAPPROPRIATE': { text: '부적절한 내용', class: 'bg-secondary' }
        };
        const typeInfo = types[type] || { text: type, class: 'bg-primary' };
        return `<span class="badge ${typeInfo.class}">${typeInfo.text}</span>`;
    }

    getContentTypeBadge(type) {
        const types = {
            'COMMENT': { text: '댓글', class: 'bg-info' },
            'POST': { text: '게시글', class: 'bg-primary' },
            'REVIEW': { text: '리뷰', class: 'bg-success' }
        };
        const typeInfo = types[type] || { text: type, class: 'bg-secondary' };
        return `<span class="badge ${typeInfo.class}">${typeInfo.text}</span>`;
    }

    getUserInfo(user) {
        return `
            <div class="d-flex align-items-center">
                <img src="${user.profileImage || 'img/user4.png'}" 
                     alt="${user.nickname}" 
                     class="rounded-circle me-2" 
                     width="40" height="40">
                <div>
                    <div class="fw-bold">${user.nickname}</div>
                    <div class="text-muted small">@${user.id}</div>
                </div>
            </div>
        `;
    }

    getReportedContentInfo(content) {
        return `
            <div class="content-info-wrapper">
                <div class="d-flex align-items-center mb-2">
                    ${this.getContentTypeBadge(content.type)}
                </div>
                <div class="content-preview mb-2">
                    ${content.preview}
                </div>
                <div class="d-flex align-items-center">
                    <img src="${content.author.profileImage || 'img/user4.png'}" 
                         alt="${content.author.nickname}" 
                         class="rounded-circle me-2" 
                         width="24" height="24">
                    <span class="text-muted small">@${content.author.id}</span>
                </div>
            </div>
        `;
    }

    getStatusBadge(status) {
        const statuses = {
            'PENDING': { text: '처리 대기', class: 'bg-warning' },
            'PROCESSED': { text: '처리 완료', class: 'bg-success' },
            'REJECTED': { text: '반려', class: 'bg-danger' }
        };
        const statusInfo = statuses[status] || { text: status, class: 'bg-secondary' };
        return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    handleWarnUser() {
        Swal.fire({
            title: '경고 발송',
            text: '해당 사용자에게 경고를 발송하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '발송',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('완료', '경고가 발송되었습니다.', 'success');
                this.modal.hide();
            }
        });
    }

    handleBlockUser() {
        Swal.fire({
            title: '이용 정지',
            text: '해당 사용자를 이용 정지하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '정지',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('완료', '사용자가 이용 정지되었습니다.', 'success');
                this.modal.hide();
            }
        });
    }

    handleDeleteContent() {
        Swal.fire({
            title: '컨텐츠 삭제',
            text: '해당 컨텐츠를 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('완료', '컨텐츠가 삭제되었습니다.', 'success');
                this.modal.hide();
            }
        });
    }

    initializeDateRangePicker() {
        const start = moment().subtract(7, 'days');
        const end = moment();

        $('#reportDateRange').daterangepicker({
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

    filterTableByDate(start, end) {
        $.fn.dataTable.ext.search.push((settings, data) => {
            const reportDate = moment(data[4], 'YYYY-MM-DD HH:mm:ss');
            return reportDate.isBetween(start, end, 'day', '[]');
        });

        this.reportTable.draw();
        $.fn.dataTable.ext.search.pop();
    }

    setModalData(report) {
        const modal = document.getElementById('reportDetailModal');
        
        // 신고 기본 정보
        modal.querySelector('.report-id').textContent = `#${report.id}`;
        modal.querySelector('.report-type').innerHTML = this.getReportTypeBadge(report.type);
        modal.querySelector('.report-date').textContent = moment(report.reportDate).format('YYYY-MM-DD HH:mm');

        // 신고자 정보
        modal.querySelector('.reporter-info').innerHTML = this.getUserInfo(report.reporter);

        // 신고된 컨텐츠 정보
        const content = report.reportedContent;
        modal.querySelector('.content-type-badge').innerHTML = this.getContentTypeBadge(content.type);
        modal.querySelector('.content-text').textContent = content.preview;
        
        // 작성자 정보
        const author = content.author;
        const authorImage = modal.querySelector('.author-image');
        authorImage.src = author.profileImage || 'img/user4.png';
        authorImage.alt = author.nickname;
        modal.querySelector('.author-nickname').textContent = author.nickname;
        modal.querySelector('.author-id').textContent = `@${author.id}`;

        // 신고 사유
        modal.querySelector('.report-reason').textContent = report.reason;
    }
}

// 페이지 로드 시 ReportManager 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    new ReportManager();
}); 