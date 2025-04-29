class AdminBoard {
    constructor() {
        this.initializeDataTable();
        this.initializeEventListeners();
        this.initializeEditor();
        this.currentView = 'list'; // list, view, write
    }

    initializeDataTable() {
        // 테스트 데이터 생성
        const testData = [
            {
                number: 1,
                title: "[공지] 여놀 서비스 업데이트 안내",
                author: "관리자",
                date: "2024-01-15",
                views: 521,
                isPinned: true
            },
            {
                number: 2,
                title: "[안내] 2024년 1월 정기점검 안내",
                author: "시스템관리자",
                date: "2024-01-14",
                views: 432,
                isPinned: true
            },
            {
                number: 3,
                title: "신규 기능 추가 안내",
                author: "관리자",
                date: "2024-01-13",
                views: 385,
                isPinned: false
            },
            {
                number: 4,
                title: "이용약관 개정 안내",
                author: "관리자",
                date: "2024-01-12",
                views: 267,
                isPinned: false
            },
            {
                number: 5,
                title: "개인정보처리방침 변경 안내",
                author: "시스템관리자",
                date: "2024-01-11",
                views: 198,
                isPinned: false
            },
            {
                number: 6,
                title: "여놀 앱 버전 업데이트 안내",
                author: "관리자",
                date: "2024-01-10",
                views: 342,
                isPinned: false
            },
            {
                number: 7,
                title: "서비스 이용 가이드",
                author: "관리자",
                date: "2024-01-09",
                views: 567,
                isPinned: false
            },
            {
                number: 8,
                title: "커뮤니티 이용규칙 안내",
                author: "시스템관리자",
                date: "2024-01-08",
                views: 289,
                isPinned: false
            },
            {
                number: 9,
                title: "신규 이벤트 안내",
                author: "관리자",
                date: "2024-01-07",
                views: 654,
                isPinned: false
            },
            {
                number: 10,
                title: "베타 테스트 참여자 모집",
                author: "관리자",
                date: "2024-01-06",
                views: 876,
                isPinned: false
            },
            {
                number: 11,
                title: "1월 이벤트 당첨자 발표",
                author: "시스템관리자",
                date: "2024-01-05",
                views: 445,
                isPinned: false
            },
            {
                number: 12,
                title: "모바일 앱 출시 안내",
                author: "관리자",
                date: "2024-01-04",
                views: 732,
                isPinned: false
            },
            {
                number: 13,
                title: "서비스 점검 완료 안내",
                author: "시스템관리자",
                date: "2024-01-03",
                views: 234,
                isPinned: false
            },
            {
                number: 14,
                title: "신규 파트너사 안내",
                author: "관리자",
                date: "2024-01-02",
                views: 543,
                isPinned: false
            },
            {
                number: 15,
                title: "2024년 서비스 운영 계획 안내",
                author: "관리자",
                date: "2024-01-01",
                views: 891,
                isPinned: false
            }
        ];

        this.table = $('#noticeTable').DataTable({
            data: testData,  // 테스트 데이터 추가
            order: [[1, 'desc']],
            columns: [
                {   // 체크박스 열
                    data: null,
                    orderable: false,
                    className: 'select-checkbox',
                    width: '3%',
                    render: function() {
                        return '<input type="checkbox" class="row-checkbox">';
                    }
                },
                {   // 번호 열
                    data: 'number',
                    width: '5%'
                },
                {   // 제목 열
                    data: 'title',
                    width: '50%',
                    render: function(data, type, row) {
                        let title = data;
                        if (row.isPinned) {
                            title = `<span class="badge bg-primary me-2">공지</span>${title}`;
                        }
                        return title;
                    }
                },
                {   // 작성자 열
                    data: 'author',
                    width: '10%'
                },
                {   // 작성일 열
                    data: 'date',
                    width: '12%'
                },
                {   // 조회수 열
                    data: 'views',
                    width: '7%',
                    className: 'text-center'
                },
                {   // 관리 열
                    data: null,
                    orderable: false,
                    width: '13%',
                    className: 'text-center',
                    render: function(data, type, row) {
                        return `
                            <button type="button" class="btn btn-sm btn-outline-primary btn-edit me-1">수정</button>
                            <button type="button" class="btn btn-sm btn-outline-danger btn-delete">삭제</button>
                        `;
                    }
                }
            ],
            columnDefs: [
                {
                    targets: [0, 6],  // 체크박스와 관리 컬럼은 정렬 제외
                    orderable: false
                }
            ],
            language: {
                search: "검색:",
                lengthMenu: "_MENU_ 개씩보기",
                "info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
                infoEmpty: "데이터가 없습니다",
                infoFiltered: "(전체 _MAX_ 개 중 검색결과)",
                paginate: {
                    first: "«",
                    last: "»",
                    next: "›",
                    previous: "‹"
                },
                emptyTable: "데이터가 없습니다."
            }
        });

        // 전체선택 체크박스 추가 및 이벤트 바인딩
        this.initializeCheckboxes();
    }

    initializeCheckboxes() {
        // 전체선택 체크박스 HTML 추가
        $('#noticeTable thead tr th:first').html('<input type="checkbox" id="selectAll">');

        // 전체선택 체크박스 이벤트
        $('#selectAll').on('click', (e) => {
            const isChecked = e.target.checked;
            
            // 현재 페이지의 모든 체크박스 선택/해제
            this.table.rows({ page: 'current' }).nodes().each((node) => {
                $(node).find('.row-checkbox').prop('checked', isChecked);
                if (isChecked) {
                    $(node).addClass('selected');
                } else {
                    $(node).removeClass('selected');
                }
            });
        });

        // 개별 체크박스 이벤트
        $('#noticeTable tbody').on('change', '.row-checkbox', (e) => {
            const checkbox = $(e.target);
            const row = checkbox.closest('tr');
            
            if (checkbox.prop('checked')) {
                row.addClass('selected');
            } else {
                row.removeClass('selected');
            }

            // 현재 페이지의 전체선택 상태 확인
            this.updateSelectAllCheckbox();
        });

        // 페이지 변경 시 전체선택 해제
        this.table.on('page.dt', () => {
            $('#selectAll').prop('checked', false);
            this.table.rows().nodes().each((node) => {
                $(node).find('.row-checkbox').prop('checked', false);
                $(node).removeClass('selected');
            });
        });
    }

    updateSelectAllCheckbox() {
        const totalRows = this.table.rows({ page: 'current' }).nodes().length;
        const selectedRows = this.table.rows({ page: 'current' }).nodes()
            .filter((node) => $(node).find('.row-checkbox').prop('checked')).length;
        
        $('#selectAll').prop('checked', totalRows === selectedRows && totalRows > 0);
    }

    initializeEventListeners() {
        // 글쓰기 버튼
        $('#writeButton').on('click', () => {
            this.showWriteForm();
        });

        // 수정 버튼 (목록에서)
        $('#noticeTable').on('click', '.btn-edit', (e) => {
            const row = this.table.row($(e.target).closest('tr'));
            const data = row.data();
            this.showEditForm(data);
        });

        // 수정 버튼 (상세보기에서)
        $('.btn-edit-post').on('click', () => {
            const postId = $('.notice-view-section').data('post-id');
            const data = this.table.rows().data().toArray()
                .find(row => row.number === postId);
            this.showEditForm(data);
        });

        // 취소 버튼
        $('.btn-cancel, .btn-back').on('click', () => {
            if (this.currentView === 'write') {
                Swal.fire({
                    title: '작성을 취소하시겠습니까?',
                    text: "작성 중인 내용은 저장되지 않습니다.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '확인',
                    cancelButtonText: '취소'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.showNoticeList();
                    }
                });
            } else {
                this.showNoticeList();
            }
        });

        // 폼 제출
        $('#noticeForm').on('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // 삭제 버튼 클릭
        $('#noticeTable').on('click', '.btn-delete', (e) => {
            const row = this.table.row($(e.target).closest('tr'));
            this.deletePost(row);
        });

        // 선택 삭제 버튼 클릭
        $('#deleteSelected').on('click', () => {
            this.deleteSelectedRows();
        });

        // 게시글 제목 클릭 이벤트
        $('#noticeTable tbody').on('click', 'td:nth-child(3)', (e) => {
            const row = this.table.row($(e.target).closest('tr'));
            const data = row.data();
            this.showNoticeView(data);
        });
    }

    initializeEditor() {
        $('#editor').summernote({
            height: 300,
            lang: 'ko-KR',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            callbacks: {
                onImageUpload: (files) => {
                    this.uploadImage(files[0]);
                }
            }
        });
    }

    showWriteForm() {
        // 폼 초기화
        $('#noticeForm')[0].reset();
        $('#postId').val('');
        $('#editor').summernote('code', '');
        $('.write-title').text('새 글 작성');

        // 화면 전환
        $('.notice-list-section, .notice-view-section').hide();
        $('.notice-write-section').show();
        this.currentView = 'write';

        // 스크롤 상단으로
        window.scrollTo(0, 0);
    }

    showEditForm(data) {
        // 폼에 데이터 채우기
        $('#postId').val(data.number);
        $('#postTitle').val(data.title);
        $('#pinToTop').prop('checked', data.isPinned);
        $('#editor').summernote('code', data.content || '');
        $('.write-title').text('글 수정');

        // 화면 전환
        $('.notice-list-section, .notice-view-section').hide();
        $('.notice-write-section').show();
        this.currentView = 'write';

        // 스크롤 상단으로
        window.scrollTo(0, 0);
    }

    handleFormSubmit() {
        const postId = $('#postId').val();
        const title = $('#postTitle').val();
        const content = $('#editor').summernote('code');
        const isPinned = $('#pinToTop').is(':checked');

        // 새 게시글 데이터
        const postData = {
            number: postId || this.table.data().length + 1,
            title: title,
            content: content,
            author: '관리자', // 실제로는 로그인한 사용자 정보 사용
            date: moment().format('YYYY-MM-DD'),
            views: 0,
            isPinned: isPinned
        };

        if (postId) {
            // 수정
            const rowIndex = this.table.rows().data().toArray()
                .findIndex(row => row.number === parseInt(postId));
            if (rowIndex !== -1) {
                this.table.row(rowIndex).data(postData).draw();
            }
        } else {
            // 새글 작성
            this.table.row.add(postData).draw();
        }

        // 성공 메시지 표시
        Swal.fire({
            icon: 'success',
            title: '저장되었습니다',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            this.showNoticeList();
        });
    }

    deletePost(row) {
        Swal.fire({
            title: '게시글을 삭제하시겠습니까?',
            text: "삭제된 게시글은 복구할 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                // TODO: API 호출
                row.remove().draw();
                if (this.currentView === 'view') {
                    this.showNoticeList();
                }
                Swal.fire('삭제 완료', '게시글이 삭제되었습니다.', 'success');
            }
        });
    }

    deleteSelectedRows() {
        const selectedRows = this.table.rows().nodes()
            .filter((node) => $(node).find('.row-checkbox').prop('checked'));
        
        if (selectedRows.length === 0) {
            Swal.fire('알림', '삭제할 항목을 선택해주세요.', 'info');
            return;
        }

        Swal.fire({
            title: '선택한 항목을 삭제하시겠습니까?',
            text: `${selectedRows.length}개의 항목이 삭제됩니다.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                // TODO: API 호출
                this.table.rows(selectedRows).remove().draw();
                $('#selectAll').prop('checked', false);
                
                Swal.fire(
                    '삭제 완료',
                    '선택한 항목이 삭제되었습니다.',
                    'success'
                );
            }
        });
    }

    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        // TODO: 실제 이미지 업로드 API 호출
        console.log('이미지 업로드:', file);
        
        // 임시 미리보기
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = $('<img>').attr('src', reader.result);
            $('#editor').summernote('insertNode', img[0]);
        };
        reader.readAsDataURL(file);
    }

    showNoticeView(data) {
        // 게시글 데이터를 화면에 표시
        $('.notice-title').text(data.title);
        $('.notice-author').text(data.author);
        $('.notice-date').text(data.date);
        $('.notice-views').text(data.views);
        $('.notice-content').html(data.content || '내용이 없습니다.'); // 실제 데이터에서는 content 필드 필요
        $('.notice-view-section').data('post-id', data.number);

        // 고정글 배지 처리
        if (data.isPinned) {
            $('.notice-title').prepend('<span class="badge bg-primary me-2">공지</span>');
        }

        // 화면 전환
        $('.notice-list-section').hide();
        $('.notice-view-section').show();
        this.currentView = 'view';

        // 스크롤을 맨 위로
        window.scrollTo(0, 0);
    }

    showNoticeList() {
        // 목록 화면으로 전환
        $('.notice-view-section, .notice-write-section').hide();
        $('.notice-list-section').show();
        this.currentView = 'list';
        
        // 폼 초기화
        $('#noticeForm')[0].reset();
        $('#editor').summernote('code', '');
    }
}

// 필요한 CSS 스타일
const styles = `
    <style>
        /* 체크박스 컬럼 스타일 */
        .select-checkbox {
            width: 30px !important;
            text-align: center !important;
            vertical-align: middle !important;
        }

        /* 체크박스 스타일 */
        .row-checkbox,
        #selectAll {
            width: 16px;
            height: 16px;
            cursor: pointer;
            vertical-align: middle;
        }

        /* 선택된 행 스타일 */
        tr.selected {
            background-color: rgba(13, 110, 253, 0.1) !important;
        }

        /* 체크박스 정렬 */
        #noticeTable thead th:first-child,
        #noticeTable tbody td:first-child {
            text-align: center;
            vertical-align: middle;
        }
    </style>
`;

// 추가 CSS 스타일
const additionalStyles = `
    
`;

// 스타일 추가
$(document).ready(() => {
    $('head').append(styles);
    $('head').append(additionalStyles);
    new AdminBoard();
});

// 탭 전환 이벤트 리스너
	$('#boardTabs a').on('click', function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	// 가이드 탭 클릭 이벤트
	$('#guide-tab').on('click', function (e) {
		e.preventDefault();
		$('.tab-pane').removeClass('show active');
		$('#guide').addClass('show active');
		$(this).addClass('active').siblings().removeClass('active');
	});

	// 공지사항 탭 클릭 이벤트
	$('#notice-tab').on('click', function (e) {
		e.preventDefault();
		$('.tab-pane').removeClass('show active');
		$('#notice').addClass('show active');
		$(this).addClass('active').siblings().removeClass('active');
	});

$(document).ready(function() {
    // 가이드 테스트 데이터
    let guideTestData = [
        {
            number: 1,
            title: "서비스 이용 가이드",
            author: "관리자",
            date: "2024-01-20",
            views: 123,
            isPinned: true,
            content: "서비스 이용 방법 안내입니다."
        },
        {
            number: 2,
            title: "게시글 작성 방법",
            author: "관리자",
            date: "2024-01-18",
            views: 98,
            isPinned: false,
            content: "게시글 작성 방법 안내입니다."
        }
    ];

    // DataTable 초기화
    const guideTable = $('#guideTable').DataTable({
        data: guideTestData,
        order: [[1, 'desc']],
        columns: [
            {
                data: null,
                orderable: false,
                className: 'select-checkbox',
                width: '3%',
                render: function() {
                    return '<input type="checkbox" class="row-checkbox">';
                }
            },
            { data: 'number', width: '5%' },
            {
                data: 'title',
                width: '50%',
                render: function(data, type, row) {
                    let title = data;
                    if (row.isPinned) {
                        title = `${title}`;
                    }
                    return title;
                }
            },
            { data: 'author', width: '10%' },
            { data: 'date', width: '12%' },
            { data: 'views', width: '7%', className: 'text-center' },
            {
                data: null,
                orderable: false,
                width: '13%',
                className: 'text-center',
                render: function() {
                    return `
                        <button type="button" class="btn btn-sm btn-outline-primary btn-edit-guide me-1">수정</button>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-delete-guide">삭제</button>
                    `;
                }
            }
        ],
        columnDefs: [
            { targets: [0, 6], orderable: false }
        ],
        language: {
            search: "검색:",
            lengthMenu: "_MENU_ 개씩보기",
            "info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
            infoEmpty: "데이터가 없습니다",
            infoFiltered: "(전체 _MAX_ 개 중 검색결과)",
            paginate: {
                first: "«",
                last: "»",
                next: "›",
                previous: "‹"
            },
            emptyTable: "데이터가 없습니다."
        }
    });

    // 전체선택 체크박스
    $('#guideTable thead tr th:first').html('<input type="checkbox" id="selectAllGuide">');
    $('#selectAllGuide').on('click', function(e) {
        const isChecked = e.target.checked;
        guideTable.rows({ page: 'current' }).nodes().each((node) => {
            $(node).find('.row-checkbox').prop('checked', isChecked);
            if (isChecked) {
                $(node).addClass('selected');
            } else {
                $(node).removeClass('selected');
            }
        });
    });
    $('#guideTable tbody').on('change', '.row-checkbox', function(e) {
        const checkbox = $(e.target);
        const row = checkbox.closest('tr');
        if (checkbox.prop('checked')) {
            row.addClass('selected');
        } else {
            row.removeClass('selected');
        }
        // 전체선택 체크박스 상태 갱신
        const totalRows = guideTable.rows({ page: 'current' }).nodes().length;
        const selectedRows = guideTable.rows({ page: 'current' }).nodes()
            .filter((node) => $(node).find('.row-checkbox').prop('checked')).length;
        $('#selectAllGuide').prop('checked', totalRows === selectedRows && totalRows > 0);
    });
    guideTable.on('page.dt', function() {
        $('#selectAllGuide').prop('checked', false);
        guideTable.rows().nodes().each((node) => {
            $(node).find('.row-checkbox').prop('checked', false);
            $(node).removeClass('selected');
        });
    });

    // SweetAlert2로 선택삭제
    $('#deleteGuideSelected').on('click', function() {
        const selectedRows = guideTable.rows().nodes()
            .filter((node) => $(node).find('.row-checkbox').prop('checked'));
        if (selectedRows.length === 0) {
            Swal.fire('알림', '삭제할 항목을 선택해주세요.', 'info');
            return;
        }
        Swal.fire({
            title: '선택한 항목을 삭제하시겠습니까?',
            text: `${selectedRows.length}개의 항목이 삭제됩니다.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                guideTable.rows(selectedRows).remove().draw();
                $('#selectAllGuide').prop('checked', false);
                Swal.fire('삭제 완료', '선택한 항목이 삭제되었습니다.', 'success');
            }
        });
    });

    // 글쓰기 버튼
    $('#writeGuideButton').on('click', function() {
        $('#guideForm')[0].reset();
        $('#guidePostId').val('');
        $('#guideEditor').summernote('code', '');
        $('.guide-write-title').text('가이드 새글작성');
        $('.guide-list-section').hide();
        $('.guide-write-section').show();
        window.scrollTo(0, 0);
    });

    // 글쓰기/수정 취소
    $('.btn-cancel-guide, .btn-back-guide').on('click', function() {
        Swal.fire({
            title: '작성을 취소하시겠습니까?',
            text: "작성 중인 내용은 저장되지 않습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                $('.guide-write-section').hide();
                $('.guide-list-section').show();
            }
        });
    });

    // 글쓰기/수정 저장
    $('#guideForm').on('submit', function(e) {
        e.preventDefault();
        const postId = $('#guidePostId').val();
        const title = $('#guidePostTitle').val();
        const isPinned = $('#guidePinToTop').is(':checked');
        const content = $('#guideEditor').summernote('code');
        const now = new Date();
        const date = now.toISOString().slice(0, 10);
        if (!title.trim()) {
            Swal.fire('알림', '제목을 입력하세요.', 'warning');
            return;
        }
        if (postId) {
            // 수정
            const rowIdx = guideTable.rows().data().toArray().findIndex(row => row.number == postId);
            if (rowIdx !== -1) {
                guideTable.row(rowIdx).data({
                    number: Number(postId),
                    title,
                    author: '관리자',
                    date,
                    views: guideTable.row(rowIdx).data().views,
                    isPinned,
                    content
                }).draw();
            }
            Swal.fire('수정 완료', '게시글이 수정되었습니다.', 'success');
        } else {
            // 새글
            const newNumber = guideTable.data().count() > 0
                ? Math.max(...guideTable.rows().data().toArray().map(r => r.number)) + 1
                : 1;
            guideTable.row.add({
                number: newNumber,
                title,
                author: '관리자',
                date,
                views: 0,
                isPinned,
                content
            }).draw();
            Swal.fire('등록 완료', '게시글이 등록되었습니다.', 'success');
        }
        $('.guide-write-section').hide();
        $('.guide-list-section').show();
    });

    // 수정 버튼
    $('#guideTable').on('click', '.btn-edit-guide', function() {
        const row = guideTable.row($(this).closest('tr'));
        const data = row.data();
        $('#guidePostId').val(data.number);
        $('#guidePostTitle').val(data.title);
        $('#guidePinToTop').prop('checked', data.isPinned);
        $('#guideEditor').summernote('code', data.content || '');
        $('.guide-write-title').text('가이드 수정');
        $('.guide-list-section').hide();
        $('.guide-write-section').show();
        window.scrollTo(0, 0);
    });

    // 삭제 버튼
    $('#guideTable').on('click', '.btn-delete-guide', function() {
        const row = guideTable.row($(this).closest('tr'));
        Swal.fire({
            title: '게시글을 삭제하시겠습니까?',
            text: "삭제된 게시글은 복구할 수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                row.remove().draw();
                Swal.fire('삭제 완료', '게시글이 삭제되었습니다.', 'success');
            }
        });
    });

    // Summernote 에디터 초기화
    $('#guideEditor').summernote({
        height: 300,
        lang: 'ko-KR',
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });
}); 


