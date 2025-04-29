class CouponManager {
    constructor() {
        // 먼저 필요한 속성들을 초기화
        this.selectedUsers = new Set();
        this.couponList = new Map();  // couponList를 먼저 초기화

        // DOM이 완전히 로드된 후 나머지 초기화
        $(document).ready(() => {
            console.log('CouponManager initialized'); // 디버깅용 로그
            this.initializeDataTables();
            this.initializeEventHandlers();
            this.addStyles();

            // 폼 제출 이벤트를 직접 바인딩
            this.initializeFormSubmission();
        });
    }

    initializeFormSubmission() {
        console.log('Initializing form submission'); // 디버깅용 로그
        
        // 폼 제출 이벤트 리스너
        $('#couponForm').on('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted'); // 디버깅용 로그

            // 폼 데이터 수집
            const formData = {
                type: $('#couponType').val(),
                validityPeriod: $('#validityPeriod').val(),
                description: $('#description').val()
            };

            console.log('Form data:', formData); // 디버깅용 로그

            // 유효성 검사
            if (!formData.type || !formData.validityPeriod) {
                alert('쿠폰 종류와 사용 기간을 모두 선택해주세요.');
                return;
            }

            // 쿠폰 생성 또는 수정
            const isEditMode = $('#couponForm').data('edit-mode');
            if (isEditMode) {
                const editId = $('#couponForm').data('edit-id');
                this.updateCoupon(editId);
            } else {
                this.createNewCoupon(formData);
            }
        });

        // 취소 버튼 이벤트
        $('#cancelEditBtn').on('click', () => {
            this.resetForm();
        });
    }

    createNewCoupon(formData) {
        console.log('Creating new coupon:', formData); // 디버깅용 로그

        // 유효기간 설정
        this.updateValidityDates(formData.validityPeriod);

        const couponData = {
            id: 'CPN' + Date.now(),
            type: formData.type,
            typeName: $('#couponType option:selected').text(),
            validityPeriod: formData.validityPeriod,
            validityStartDate: this.validityStartDate,
            validityEndDate: this.validityEndDate,
            description: formData.description,
            createDate: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        try {
            // 쿠폰 데이터 저장
            this.couponList.set(couponData.id, couponData);

            // 테이블에 추가
            if (this.couponListTable) {
                this.couponListTable.row.add({
                    id: couponData.id,
                    type: this.getCouponTypeBadge(couponData.type),
                    description: couponData.description || '-',
                    createDate: couponData.createDate,
                    expireDate: couponData.validityEndDate,
                    status: '<span class="badge badge-success">활성</span>',
                    usedQuantity: '0',
                    actions: `
                        <button class="btn btn-sm btn-info edit-coupon" data-coupon-id="${couponData.id}">수정</button>
                        <button class="btn btn-sm btn-danger delete-coupon" data-coupon-id="${couponData.id}">삭제</button>
                    `
                }).draw();

                // 폼 초기화
                this.resetForm();
                alert('쿠폰이 성공적으로 생성되었습니다.');
            } else {
                console.error('couponListTable is not initialized');
                alert('테이블 초기화 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert('쿠폰 생성 중 오류가 발생했습니다.');
        }
    }

    updateValidityDates(period) {
        console.log('Updating validity dates for period:', period); // 디버깅용 로그
        
        const startDate = moment();
        let endDate = moment();

        switch(period) {
            case 'TODAY':
                endDate = moment().endOf('day');
                break;
            case '3M':
                endDate = moment().add(3, 'months').endOf('day');
                break;
            case '6M':
                endDate = moment().add(6, 'months').endOf('day');
                break;
            case '12M':
                endDate = moment().add(12, 'months').endOf('day');
                break;
            default:
                console.warn('Unknown period:', period);
                return;
        }

        this.validityStartDate = startDate.format('YYYY-MM-DD');
        this.validityEndDate = endDate.format('YYYY-MM-DD');
        console.log('Validity dates updated:', this.validityStartDate, this.validityEndDate);
    }

    resetForm() {
        $('#couponForm')[0].reset();
        this.validityStartDate = null;
        this.validityEndDate = null;
        $('#couponForm').data('edit-mode', false);
        $('#couponForm').data('edit-id', '');
        $('#createCouponBtn').html('<i class="icon-plus"></i> 쿠폰 생성');
        $('#createCouponBtn').removeClass('btn-success').addClass('btn-primary');
        $('#cancelEditBtn').hide();
    }

    initializeDataTables() {
        // 쿠폰 리스트 테이블
        if (!$.fn.DataTable.isDataTable('#couponListTable')) {
            this.couponListTable = $('#couponListTable').DataTable({
                language: {
                    "emptyTable": "생성된 쿠폰이 없습니다",
                    "info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                    "infoEmpty": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                    "infoFiltered": "(전체 _MAX_ 건 중 검색결과)",
                    "search": "검색:",
                    "paginate": {
                        "first": "«",
                        "last": "»",
                        "next": "›",
                        "previous": "‹"
                    },
                    "lengthMenu": "_MENU_ 개씩 보기"
                },
                columns: [
                    { 
                        data: 'id',
                        render: function(data) {
                            return `<span class="text-primary">${data}</span>`;
                        }
                    },
                    { data: 'type' },
                    { data: 'description' },
                    { data: 'createDate' },
                    { data: 'expireDate' },
                    { data: 'status' },
                    { data: 'usedQuantity' },
                    { data: 'actions' }
                ],
                order: [[3, 'desc']] // 생성일시 기준 정렬
            });
        }

        // 유저 리스트 테이블
        if (!$.fn.DataTable.isDataTable('#userListTable')) {
            this.userListTable = $('#userListTable').DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "발송 내역이 없습니다",
                    "info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                    "infoEmpty": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                    "infoFiltered": "(전체 _MAX_ 건 중 검색결과)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "_MENU_ 개씩 보기",
                    "loadingRecords": "로딩중...",
                    "processing": "처리중...",
                    "search": "검색:",
                    "zeroRecords": "검색된 발송 내역이 없습니다",
                    "paginate": {
                        "first": "«",
                        "last": "»",
                        "next": "›",
                        "previous": "‹"
                    },
                    "lengthMenu": "_MENU_ 개씩 보기"
                },
                columns: [
                    { 
                        data: 'checkbox',
                        orderable: false,
                        searchable: false
                    },
                    { data: 'userId' },
                    { 
                        data: 'nickname',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                return `
                                    <div class="d-flex align-items-center">
                                        <div class="user-img-sm mr-2">
                                            <img src="img/user12.png" alt="User" class="rounded-circle" width="32" height="32">
                                        </div>
                                        <div>
                                            <div class="user-name">${data}</div>
                                            <div class="user-id text-muted small">${row.userId}</div>
                                        </div>
                                    </div>
                                `;
                            }
                            return data;
                        }
                    },
                    { data: 'joinDate' },
                    { data: 'lastLogin' },
                    { 
                        data: 'coupons',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const couponList = data.list || []; // 쿠폰 목록
                                const totalCount = data.count || 0; // 전체 개수

                                const couponItems = couponList.map(coupon => `
                                    <div class="coupon-item">
                                        <span class="coupon-badge ${coupon.type.toLowerCase()}">${coupon.name}</span>
                                        <span class="coupon-expire small">
                                            ${moment(coupon.expireDate).format('YYYY-MM-DD')} 까지
                                        </span>
                                    </div>
                                `).join('');

                                return `
                                    <div class="coupon-status-wrapper">
                                        <div class="coupon-summary" data-toggle="collapse" 
                                            data-target="#couponDetail_${row.userId}" 
                                            aria-expanded="false">
                                            <div class="coupon-count-wrap">
                                                <div class="coupon-count">
                                                    <i class="icon-ticket mr-1"></i>
                                                    <span class="count-number">${totalCount} 장</span>
                                                </div>
                                                <div class="small text-muted mt-1">
                                                    <i class="icon-chevron-down"></i> 상세보기
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div class="collapse coupon-list-wrapper mt-2" id="couponDetail_${row.userId}">
                                            ${couponList.length > 0 ? couponItems : '<div class="no-coupons">보유 쿠폰 없음</div>'}
                                        </div>
                                    </div>
                                `;
                            }
                            return data.count || 0;
                        }
                    }
                ],
                order: [[3, 'desc']] // 가입일 기준 정렬
            });
        }

        // 발송 내역 테이블
        if (!$.fn.DataTable.isDataTable('#historyTable')) {
            this.historyTable = $('#historyTable').DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "발송 내역이 없습니다",
                    "info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                    "infoEmpty": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                    "infoFiltered": "(전체 _MAX_ 건 중 검색결과)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "_MENU_ 개씩 보기",
                    "loadingRecords": "로딩중...",
                    "processing": "처리중...",
                    "search": "검색:",
                    "zeroRecords": "검색된 발송 내역이 없습니다",
                    "paginate": {
                        "first": "«",
                        "last": "»",
                        "next": "›",
                        "previous": "‹"
                    },
                    "aria": {
                        "sortAscending": ": 오름차순 정렬",
                        "sortDescending": ": 내림차순 정렬"
                    }
                },
                order: [[2, 'desc']], // 발송일시 기준 내림차순
                columns: [
                    { data: 'sendId' },
                    { data: 'couponType' },
                    { data: 'sendDate' },
                    { 
                        data: 'recipient',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const [nickname, userId] = data.split(' (');
                                return `
                                    <div class="d-flex align-items-center">
                                        <div class="user-img-sm mr-2">
                                            <img src="img/user2.png" alt="User" class="rounded-circle" width="32" height="32">
                                        </div>
                                        <div>
                                            <div class="user-name">${nickname}</div>
                                            <div class="user-id text-muted small">${userId.replace(')', '')}</div>
                                        </div>
                                    </div>
                                `;
                            }
                            return data;
                        }
                    },
                    { data: 'status' },
                    { data: 'expireDate' },
                    { 
                        data: 'usageStatus',
                        render: function(data, type, row) {
                            if (type === 'display') {
                                const now = moment();
                                const expireDate = moment(row.expireDate);
                                
                                if (data === 'USED') {
                                    return '<span class="badge badge-success">사용완료</span>';
                                } else if (data === 'UNUSED') {
                                    if (now > expireDate) {
                                        return '<span class="badge badge-secondary">기간만료</span>';
                                    }
                                    return '<span class="badge badge-warning">미사용</span>';
                                }
                            }
                            return data;
                        }
                    }
                ],
                createdRow: function(row, data, dataIndex) {
                    // 만료된 쿠폰의 행 스타일 적용
                    if (moment() > moment(data.expireDate) && data.usageStatus === 'UNUSED') {
                        $(row).addClass('text-muted');
                    }
                },
                dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
                     '<"row"<"col-sm-12"tr>>' +
                     '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                lengthMenu: [[10, 25, 50, -1], ['10개씩', '25개씩', '50개씩', '모두 보기']]
            });
        }
    }

    initializeEventHandlers() {
        // 탭 변경 이벤트
        $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            const targetTab = $(e.target).attr('href');
            
            switch(targetTab) {
                case '#create':
                    // 쿠폰 만들기 탭
                    this.handleCreateTab();
                    break;
                case '#users':
                    // 쿠폰 발송 대상 탭
                    this.handleUsersTab();
                    break;
                case '#history':
                    // 발송 내역 탭
                    this.handleHistoryTab();
                    break;
            }
        });

        // 기존 이벤트 핸들러들...
        this.initializeCreateTabEvents();
        this.initializeUsersTabEvents();
        this.initializeHistoryTabEvents();
    }

    // 쿠폰 만들기 탭 관련 이벤트
    initializeCreateTabEvents() {
        // 사용 기간 변경 이벤트
        $('#validityPeriod').on('change', (e) => {
            this.updateValidityDates($(e.target).val());
        });

        // 발급 대상 선택 이벤트
        $('#targetType').on('change', (e) => {
            const targetType = $(e.target).val();
            this.handleTargetTypeChange(targetType);
        });

        // 등급 선택 이벤트
        $('.grade-checkbox').on('change', () => {
            this.handleGradeSelection();
        });

        // 사용자 검색 버튼 클릭 이벤트
        $('#searchBtn').on('click', () => {
            this.searchUsers();
        });

        // 전체 선택 체크박스
        $('#selectAll').on('change', (e) => {
            const isChecked = $(e.target).prop('checked');
            $('.user-select').prop('checked', isChecked);
            this.updateSendButtonState();
        });

        // 쿠폰 발송 버튼
        $('#sendCouponBtn').on('click', () => {
            this.sendCoupons();
        });

        // 쿠폰 선택 이벤트
        $('#selectCoupon').on('change', (e) => {
            const couponId = $(e.target).val();
            this.showSelectedCouponInfo(couponId);
        });

        // 사용자 추가 버튼 클릭 이벤트
        $(document).on('click', '.add-user', (e) => {
            const userId = $(e.target).closest('button').data('user-id');
            const nickname = $(e.target).closest('button').data('user-nickname');
            this.addSelectedUser(userId, nickname);
        });

        // 선택된 사용자 제거 이벤트
        $(document).on('click', '.remove-selected-user', (e) => {
            const userId = $(e.target).closest('button').data('user-id');
            this.removeSelectedUser(userId);
        });

        // 쿠폰 수정 버튼 클릭 이벤트
        $(document).on('click', '.edit-coupon', (e) => {
            const couponId = $(e.target).data('coupon-id');
            this.editCoupon(couponId);
        });

        // 쿠폰 삭제 버튼 클릭 이벤트
        $(document).on('click', '.delete-coupon', (e) => {
            const couponId = $(e.target).data('coupon-id');
            this.deleteCoupon(couponId);
        });
    }

    // 쿠폰 발송 대상 탭 관련 이벤트
    initializeUsersTabEvents() {
        // 탭이 표시될 때 쿠폰 드롭다운 업데이트
        $('#users-tab').on('shown.bs.tab', () => {
            this.updateCouponDropdown();
        });
    }

    // 발송 내역 탭 관련 이벤트
    initializeHistoryTabEvents() {
        // 탭이 표시될 때만 DateRangePicker 초기화
        $('#history-tab').on('shown.bs.tab', () => {
            this.initializeDateRangePicker();
        });

        // 빠른 필터 버튼 이벤트
        $('.date-quick-filters .btn').on('click', (e) => {
            const period = $(e.target).data('period');
            let startDate, endDate;

            $('.date-quick-filters .btn').removeClass('active');
            $(e.target).addClass('active');

        switch(period) {
            case 'TODAY':
                endDate = moment().endOf('day');
                break;
            case '3M':
                endDate = moment().add(3, 'months').subtract(1, 'day');
                break;
            case '6M':
                endDate = moment().add(6, 'months').subtract(1, 'day');
                break;
            case '12M':
                endDate = moment().add(12, 'months').subtract(1, 'day');
                break;
        }

            if ($('#historyDateRange').data('daterangepicker')) {
                $('#historyDateRange').data('daterangepicker').setStartDate(startDate);
                $('#historyDateRange').data('daterangepicker').setEndDate(endDate);
            }
        });
    }

    initializeDateRangePicker() {
        if (!$.fn.daterangepicker) {
            console.error('DateRangePicker library is not loaded');
            return;
        }

        const start = moment().subtract(7, 'days');
        const end = moment();

        try {
            $('#historyDateRange').daterangepicker({
                startDate: start,
                endDate: end,
                showDropdowns: true,  // 연도, 월 직접 선택 가능
                autoApply: false,     // 적용 버튼 표시
                opens: 'left',        // 달력 왼쪽에 표시
                ranges: {
                    '오늘': [moment(), moment()],
                    '어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '최근 7일': [moment().subtract(6, 'days'), moment()],
                    '최근 30일': [moment().subtract(29, 'days'), moment()],
                    '이번 달': [moment().startOf('month'), moment().endOf('month')],
                    '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    '최근 3개월': [moment().subtract(3, 'months'), moment()],
                    '최근 6개월': [moment().subtract(6, 'months'), moment()]
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
                    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                    firstDay: 0
                },
                alwaysShowCalendars: true,  // 항상 달력 표시
                minYear: 2020,              // 최소 연도
                maxYear: parseInt(moment().format('YYYY'), 10), // 현재 연도까지
                minDate: moment('2020-01-01'), // 최소 선택 가능 날짜
                maxDate: moment()           // 오늘까지만 선택 가능
            }, (start, end) => {
                this.handleHistoryDateRangeSelect(start, end);
                
                // 선택된 날짜 표시 업데이트
                $('#historyDateRange').val(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
                
                // 빠른 선택 버튼들의 활성화 상태 초기화
                $('.date-quick-filters .btn').removeClass('active');
            });

            // 초기 날짜 설정
            this.handleHistoryDateRangeSelect(start, end);
            $('#historyDateRange').val(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
            
            console.log('DateRangePicker initialized successfully');
        } catch (error) {
            console.error('Error initializing DateRangePicker:', error);
        }
    }

    // 각 탭 처리 메서드
    handleCreateTab() {
        if (this.couponListTable) {
            this.couponListTable.columns.adjust();
        }
    }

    handleUsersTab() {
        if (this.userListTable) {
            this.userListTable.columns.adjust();
        }
        this.updateCouponDropdown();
    }

    handleHistoryTab() {
        if (this.historyTable) {
            this.historyTable.columns.adjust();
        }
    }

    handleHistoryDateRangeSelect(start, end) {
        $('#historyDateRange').val(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));

        // 히스토리 테이블 필터링
        if (this.historyTable) {
            $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
                if (settings.nTable.id !== 'historyTable') {
                    return true;
                }

                const sendDate = moment(data[2], 'YYYY-MM-DD HH:mm:ss');
                return sendDate.isBetween(start, end, 'day', '[]');
            });

            this.historyTable.draw();
            
            // 필터 제거
            $.fn.dataTable.ext.search.pop();
        }
    }

    handleTargetTypeChange(targetType) {
        // 모든 선택 영역 숨기기
        $('#gradeSelection, #customSelection').hide();
        
        // 테이블 초기화
        this.userListTable.clear().draw();

        // 선택된 사용자 초기화
        this.selectedUsers.clear();
        $('#selectedUsers').empty();
        this.updateSelectedUserCount();

        // 선택된 타입에 따라 UI 업데이트
        switch(targetType) {
            case 'GRADE':
                $('#gradeSelection').show();
                $('.grade-checkbox').prop('checked', false);
                break;
            case 'CUSTOM':
                $('#customSelection').show();
                $('#userSearch').val('');
                $('#searchResults').empty();
                break;
            case 'ALL':
            case 'NEW':
            case 'INACTIVE':
                this.loadUsersByType(targetType);
                break;
        }
    }

    handleGradeSelection() {
        const selectedGrades = $('.grade-checkbox:checked').map(function() {
            return $(this).val();
        }).get();

        if (selectedGrades.length > 0) {
            // 실제 구현에서는 API 호출로 해당 등급의 사용자 목록을 가져와야 함
            this.loadUsersByGrades(selectedGrades);
        } else {
            this.userListTable.clear().draw();
        }
    }

    loadUsersByType(targetType) {
        // 실제 구현에서는 API 호출이 필요함
        // 임시 데이터로 예시
        const mockUsers = [
            { id: 'USER1', nickname: '사용자1', joinDate: '2024-01-01', lastLogin: '2024-03-14', coupons: 5 },
            { id: 'USER2', nickname: '사용자2', joinDate: '2024-02-01', lastLogin: '2024-03-15', coupons: 3 }
        ];
        this.updateUserTable(mockUsers);
    }

    loadUsersByGrades(grades) {
        // 실제 구현에서는 API 호출이 필요함
        // 임시 데이터로 예시
        const mockUsers = [
            { id: 'USER3', nickname: '골드사용자', joinDate: '2024-01-01', lastLogin: '2024-03-14', coupons: 5 },
            { id: 'USER4', nickname: '실버사용자', joinDate: '2024-02-01', lastLogin: '2024-03-15', coupons: 3 }
        ];
        this.updateUserTable(mockUsers);
    }

    searchUsers() {
        const searchTerm = $('#userSearch').val();
        if (!searchTerm) {
            alert('검색어를 입력해주세요.');
            return;
        }

        // 실제 구현에서는 API 호출이 필요함
        // 임시 데이터로 예시
        const mockSearchResults = [
            { id: 'USER5', nickname: '검색된사용자1' },
            { id: 'USER6', nickname: '검색된사용자2' }
        ];

        const resultsHtml = mockSearchResults.map(user => `
            <div class="search-result-item p-2 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="user-img-sm mr-2">
                            <img src="img/user-default.png" alt="User" class="rounded-circle" width="32" height="32">
                        </div>
                        <div>
                            <div class="user-name">${user.nickname}</div>
                            <div class="user-id text-muted small">${user.id}</div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary add-user" 
                            data-user-id="${user.id}" 
                            data-user-nickname="${user.nickname}">
                        <i class="icon-plus"></i> 추가
                    </button>
                </div>
            </div>
        `).join('');

        $('#searchResults').html(resultsHtml);
    }

    updateUserTable(users) {
        this.userListTable.clear();
        users.forEach(user => {
            // 예시 쿠폰 데이터 (실제 구현 시에는 API에서 받아온 데이터 사용)
            const mockCoupons = {
                count: 3,
                list: [
                    {
                        type: 'DAILY',
                        name: '매일매일 쿠폰',
                        expireDate: '2024-04-30'
                    },
                    {
                        type: 'PROFILE',
                        name: '상세프로필보기',
                        expireDate: '2024-05-15'
                    },
                    {
                        type: 'LIKE',
                        name: '좋아요',
                        expireDate: '2024-05-01'
                    }
                ]
            };

            this.userListTable.row.add({
                checkbox: `<div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input user-select" id="user_${user.id}">
                    <label class="custom-control-label" for="user_${user.id}"></label>
                </div>`,
                userId: user.id,
                nickname: user.nickname,
                joinDate: user.joinDate,
                lastLogin: user.lastLogin,
                coupons: mockCoupons
            }).draw(false);
        });

        // 체크박스 이벤트 재바인딩
        $('.user-select').on('change', () => {
            this.updateSendButtonState();
        });
    }

    updateSendButtonState() {
        const selectedCount = $('.user-select:checked').length;
        const hasSelectedCoupon = $('#selectCoupon').val() !== '';
        $('#sendCouponBtn').prop('disabled', selectedCount === 0 || !hasSelectedCoupon);
        $('#sendCouponBtn').text(`선택한 유저에게 쿠폰 발송 (${selectedCount}명)`);
    }

    updateCouponDropdown() {
        const $select = $('#selectCoupon');
        $select.empty().append('<option value="">쿠폰을 선택하세요</option>');

        // couponList가 비어있을 때의 처리 추가
        if (!this.couponList || this.couponList.size === 0) {
            $select.append('<option value="" disabled>생성된 쿠폰이 없습니다</option>');
            return;
        }

        this.couponList.forEach((coupon, id) => {
            $select.append(`
                <option value="${id}">
                    ${coupon.typeName} (${moment(coupon.validityEndDate).format('YYYY-MM-DD')}까지)
                </option>
            `);
        });
    }

    showSelectedCouponInfo(couponId) {
        const $infoDiv = $('#selectedCouponInfo');
        if (!couponId) {
            $infoDiv.hide();
            return;
        }

        const coupon = this.couponList.get(couponId);
        if (coupon) {
            $('#selectedCouponType').text(coupon.typeName);
            $('#selectedCouponValidity').text(
                `${moment(coupon.validityStartDate).format('YYYY-MM-DD')} ~ ${moment(coupon.validityEndDate).format('YYYY-MM-DD')}`
            );
            $('#selectedCouponStatus').html('<span class="badge badge-success">활성</span>');
            $infoDiv.show();
        }
    }

    sendCoupons() {
        const selectedCouponId = $('#selectCoupon').val();
        if (!selectedCouponId) {
            alert('발송할 쿠폰을 선택해주세요.');
            return;
        }

        const selectedUsers = $('.user-select:checked').map(function() {
            return {
                id: $(this).closest('tr').find('td:eq(1)').text(),
                nickname: $(this).closest('tr').find('td:eq(2)').text(),
                imageUrl: 'img/user-default.png' // 실제 구현시에는 사용자의 실제 이미지 URL을 사용
            };
        }).get();

        if (selectedUsers.length === 0) {
            alert('발송할 대상을 선택해주세요.');
            return;
        }

        const coupon = this.couponList.get(selectedCouponId);
        if (confirm(`선택한 ${selectedUsers.length}명의 유저에게 ${coupon.typeName} 쿠폰을 발송하시겠습니까?`)) {
            // 발송 내역에 추가
            selectedUsers.forEach(user => {
                this.historyTable.row.add({
                    sendId: 'SND' + Date.now(),
                    couponType: this.getCouponTypeBadge(coupon.type),
                    sendDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    recipient: `${user.nickname} (${user.id})`,
                    status: '<span class="badge badge-success">발송완료</span>',
                    expireDate: coupon.validityEndDate,
                    usageStatus: 'UNUSED'
                }).draw();
            });

            alert('쿠폰이 발송되었습니다.');
            $('.user-select, #selectAll').prop('checked', false);
            this.updateSendButtonState();
        }
    }

    getCouponTypeBadge(type) {
        const types = {
            'DAILY': ['매일매일 쿠폰', 'daily-coupon'],
            'CARD': ['데일리카드뽑기', 'card-draw'],
            'PROFILE': ['상세프로필보기', 'profile-view'],
            'LIKE': ['좋아요', 'like'],
            'SPECIAL_LIKE': ['스페셜 좋아요 뿌리기', 'special-like']
        };

        const [name, className] = types[type];
        return `<span class="coupon-type-badge ${className}">${name}</span>`;
    }

    addSelectedUser(userId, nickname) {
        if (!this.selectedUsers.has(userId)) {
            this.selectedUsers.add(userId);
            const userElement = `
                <div class="selected-user-item" id="user-${userId}">
                    <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
                        <div class="d-flex align-items-center">
                            <div class="user-img-sm mr-2">
                                <img src="img/user-default.png" alt="User" class="rounded-circle" width="32" height="32">
                            </div>
                            <div>
                                <div class="user-name">${nickname}</div>
                                <div class="user-id text-muted small">${userId}</div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-selected-user" 
                                data-user-id="${userId}">
                            <i class="icon-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            $('#selectedUsers').append(userElement);
            this.updateSelectedUserCount();
        }
    }

    removeSelectedUser(userId) {
        if (this.selectedUsers.has(userId)) {
            this.selectedUsers.delete(userId);
            $(`#user-${userId}`).remove();
            this.updateSelectedUserCount();
        }
    }

    updateSelectedUserCount() {
        $('#selectedUserCount').text(this.selectedUsers.size);
        // 발송 버튼 상태 업데이트
        const hasSelectedCoupon = $('#selectCoupon').val() !== '';
        $('#sendCouponBtn').prop('disabled', this.selectedUsers.size === 0 || !hasSelectedCoupon);
    }

    // 쿠폰 사용 상태 업데이트 메서드 추가
    updateCouponUsage(sendId, used = true) {
        const row = this.historyTable.rows((idx, data) => data.sendId === sendId).nodes().to$();
        if (row.length > 0) {
            this.historyTable.row(row).data(function(data) {
                data.usageStatus = used ? 'USED' : 'UNUSED';
                return data;
            }).draw();
        }
    }

    // 스타일 적용을 위한 CSS 추가
    addStyles() {
        const styles = `
            <style>
                .badge-warning {
                    background-color: #ffc107;
                    color: #000;
                }
                .badge-secondary {
                    background-color: #6c757d;
                    color: #fff;
                }
                .text-muted {
                    color: #6c757d !important;
                }
                .user-img-sm {
                    width: 32px;
                    height: 32px;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .user-img-sm img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .user-name {
                    font-weight: 500;
                    line-height: 1.2;
                }
                .user-id {
                    font-size: 0.875rem;
                }
                #historyTable td {
                    vertical-align: middle;
                }
                #cancelEditBtn {
                    margin-right: 10px;
                }
                
                .btn-success {
                    background-color: #28a745;
                    border-color: #28a745;
                    color: #fff;
                }
                
                .btn-success:hover {
                    background-color: #218838;
                    border-color: #1e7e34;
                }

                #userListTable td {
                    vertical-align: middle;
                }
                
                .search-result-item:hover {
                    background-color: #f8f9fa;
                }
                
                .selected-user-item {
                    background-color: #fff;
                    transition: background-color 0.2s;
                }
                
                .selected-user-item:hover {
                    background-color: #f8f9fa;
                }
                
                .badge-info {
                    background-color: #17a2b8;
                    color: #fff;
                }

                .coupon-status-wrapper {
                    min-width: 200px;
                    padding: 8px;
                }

                .coupon-summary {
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }

                .coupon-summary:hover {
                    background-color: rgba(23, 162, 184, 0.1);
                }

                .coupon-list-wrapper {
                    border-top: 1px solid rgba(0,0,0,0.1);
                    padding-top: 8px;
                    margin-top: 8px;
                }

                .coupon-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 0;
                    margin-bottom: 4px;
                }

                .coupon-badge {
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.85em;
                    font-weight: 500;
                }

                .coupon-badge.daily {
                    background-color: #ffc107;
                    color: #000;
                }

                .coupon-badge.profile {
                    background-color: #28a745;
                    color: #fff;
                }

                .coupon-badge.like {
                    background-color: #dc3545;
                    color: #fff;
                }

                .coupon-expire {
                    color: #6c757d;
                }

                .no-coupons {
                    color: #6c757d;
                    text-align: center;
                    padding: 8px;
                    font-size: 0.9em;
                }

                .icon-chevron-down {
                    font-size: 0.8em;
                    transition: transform 0.2s;
                }

                [aria-expanded="true"] .icon-chevron-down {
                    transform: rotate(180deg);
                }
            </style>
        `;
        $('head').append(styles);
    }

    editCoupon(couponId) {
        const coupon = this.couponList.get(couponId);
        if (!coupon) return;

        // 폼에 기존 데이터 채우기
        $('#couponType').val(coupon.type);
        $('#validityPeriod').val(coupon.validityPeriod);
        $('#description').val(coupon.description);

        // 수정 모드로 전환
        $('#couponForm').data('edit-mode', true);
        $('#couponForm').data('edit-id', couponId);
        
        // 버튼 텍스트 및 아이콘 변경
        $('#createCouponBtn').html('<i class="icon-check"></i> 쿠폰 수정하기');
        $('#createCouponBtn').removeClass('btn-primary').addClass('btn-success');
        
        // 취소 버튼 표시
        $('#cancelEditBtn').show();

        // 탭 전환
        $('#couponTab a[href="#create"]').tab('show');
    }

    deleteCoupon(couponId) {
        if (confirm('이 쿠폰을 삭제하시겠습니까?')) {
            // 쿠폰 리스트에서 제거
            this.couponList.delete(couponId);

            // 테이블에서 해당 행 제거
            this.couponListTable.rows((idx, data) => data.id === couponId)
                .remove()
                .draw();

            alert('쿠폰이 삭제되었습니다.');
        }
    }

    updateCoupon(couponId) {
        const updatedData = {
            id: couponId,
            type: $('#couponType').val(),
            typeName: $('#couponType option:selected').text(),
            validityPeriod: $('#validityPeriod').val(),
            validityStartDate: this.validityStartDate,
            validityEndDate: this.validityEndDate,
            description: $('#description').val()
        };

        if (!this.validateCouponData(updatedData)) {
            return;
        }

        // 쿠폰 데이터 업데이트
        this.couponList.set(couponId, updatedData);

        // 테이블 행 업데이트
        this.couponListTable.rows((idx, data) => data.id === couponId)
            .data({
                id: updatedData.id,
                type: this.getCouponTypeBadge(updatedData.type),
                description: updatedData.description || '-',
                createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                expireDate: updatedData.validityEndDate,
                status: '<span class="badge badge-success">활성</span>',
                usedQuantity: '0',
                actions: `
                    <button class="btn btn-sm btn-info edit-coupon" data-coupon-id="${updatedData.id}">수정</button>
                    <button class="btn btn-sm btn-danger delete-coupon" data-coupon-id="${updatedData.id}">삭제</button>
                `
            })
            .draw();

        // 폼 초기화 및 버튼 상태 원복
        this.resetForm();
        
        alert('쿠폰이 수정되었습니다.');
    }

    validateCouponData(data) {
        if (!data.type) {
            alert('쿠폰 종류를 선택해주세요.');
            return false;
        }
        if (!data.validityPeriod) {
            alert('사용 기간을 선택해주세요.');
            return false;
        }
        return true;
    }
}

// 페이지 로드 시 CouponManager 인스턴스 생성
$(document).ready(() => {
    console.log('Document ready, creating CouponManager instance'); // 디버깅용 로그
    window.couponManager = new CouponManager();
}); 