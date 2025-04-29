const AudioContent = {
    init: function() {
        this.handleBulkActions();
        this.initAudioModal();
        this.initFilterManager();
        this.initCheckboxManager();
    },

    initAudioModal: function() {
        // 오디오 모달 관련 코드...
    },

    initFilterManager: function() {
        const FilterManager = {
            init: function() {
                this.bindEvents();
            },

            bindEvents: function() {
                $('#statusFilter, #reportFilter, #sortFilter').on('change', () => {
                    this.applyFilters();
                });
            },

            applyFilters: function() {
                const statusFilter = $('#statusFilter').val();
                const reportFilter = $('#reportFilter').val();
                const sortFilter = $('#sortFilter').val();

                // 모든 행 표시
                $('.audio-table tbody tr').show();

                // 상태 필터 적용
                if (statusFilter) {
                    $('.audio-table tbody tr').each(function() {
                        const status = $(this).find('.content-status-badge').hasClass(`status-${statusFilter}`);
                        if (!status) {
                            $(this).hide();
                        }
                    });
                }

                // 신고 필터 적용
                if (reportFilter) {
                    $('.audio-table tbody tr').each(function() {
                        const reportCount = parseInt($(this).find('td:last').text());
                        if (reportFilter === 'reported' && reportCount === 0) {
                            $(this).hide();
                        } else if (reportFilter === 'not-reported' && reportCount > 0) {
                            $(this).hide();
                        }
                    });
                }

                // 정렬 적용
                this.sortAudios(sortFilter);

                // 체크박스 상태 초기화
                CheckboxManager.updateSelectAllState();
                CheckboxManager.updateSelectedCount();
            },

            sortAudios: function(sortFilter) {
                const tbody = $('.audio-table tbody');
                const rows = tbody.find('tr').toArray();

                rows.sort((a, b) => {
                    switch(sortFilter) {
                        case 'latest':
                            return this.compareDates($(b), $(a));
                        case 'oldest':
                            return this.compareDates($(a), $(b));
                        case 'views':
                            return this.compareNumbers($(b), $(a), 8);
                        case 'likes':
                            return this.compareNumbers($(b), $(a), 9);
                        case 'reports':
                            return this.compareNumbers($(b), $(a), 10);
                        default:
                            return 0;
                    }
                });

                tbody.empty().append(rows);
            },

            compareDates: function($a, $b) {
                const dateA = new Date($a.find('.date-column').text());
                const dateB = new Date($b.find('.date-column').text());
                return dateA - dateB;
            },

            compareNumbers: function($a, $b, index) {
                const numA = parseInt($a.find(`td:eq(${index})`).text());
                const numB = parseInt($b.find(`td:eq(${index})`).text());
                return numA - numB;
            }
        };

        FilterManager.init();
    },

    initCheckboxManager: function() {
        const CheckboxManager = {
            init: function() {
                this.bindEvents();
                this.updateSelectedCount();
            },

            bindEvents: function() {
                // 전체 선택 체크박스
                $('.select-all-checkbox').on('change', (e) => {
                    const isChecked = e.target.checked;
                    $('.audio-table tbody tr:visible .row-checkbox').prop('checked', isChecked);
                    this.updateSelectedCount();
                    this.updateBulkActionButtons();
                });

                // 개별 체크박스
                $('.audio-table').on('change', '.row-checkbox', () => {
                    this.updateSelectAllState();
                    this.updateSelectedCount();
                    this.updateBulkActionButtons();
                });
            },

            updateSelectAllState: function() {
                const visibleCheckboxes = $('.audio-table tbody tr:visible .row-checkbox');
                const checkedBoxes = visibleCheckboxes.filter(':checked');
                const selectAllCheckbox = $('.select-all-checkbox');

                if (visibleCheckboxes.length === 0) {
                    selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
                } else if (checkedBoxes.length === 0) {
                    selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
                } else if (checkedBoxes.length === visibleCheckboxes.length) {
                    selectAllCheckbox.prop('checked', true).prop('indeterminate', false);
                } else {
                    selectAllCheckbox.prop('checked', false).prop('indeterminate', true);
                }
            },

            updateSelectedCount: function() {
                const checkedCount = $('.audio-table tbody tr:visible .row-checkbox:checked').length;
                $('.selected-count .count').text(checkedCount);
                this.updateBulkActionButtons();
            },

            updateBulkActionButtons: function() {
                const hasChecked = $('.audio-table tbody tr:visible .row-checkbox:checked').length > 0;
                $('#bulkWarning, #bulkBlock, #bulkDelete').prop('disabled', !hasChecked);
            }
        };

        window.CheckboxManager = CheckboxManager;
        CheckboxManager.init();
    },

    handleBulkActions: function() {
        // 경고 버튼 클릭 시
        $('#bulkWarning').on('click', function() {
            const selectedRows = $('.row-checkbox:checked').closest('tr');
            if (selectedRows.length > 0) {
                $('#warningModal').modal('show');
            }
        });

        // 경고 모달의 발송 버튼 클릭 시
        $('#sendWarningBtn').on('click', function() {
            const selectedRows = $('.row-checkbox:checked').closest('tr');
            const warningType = $('#warningType').val();
            
            if (!warningType) {
                Swal.fire('오류', '경고 유형을 선택해주세요.', 'error');
                return;
            }

            $(selectedRows).each(function() {
                $(this).find('.content-status-badge')
                    .removeClass('status-active status-blocked status-deleted')
                    .addClass('status-warning')
                    .text('경고');
            });

            $('#warningModal').modal('hide');
            if (typeof CheckboxManager !== 'undefined') {
                CheckboxManager.updateSelectedCount();
            }
            Swal.fire('완료', '경고가 발송되었습니다.', 'success');

            // 모달 폼 초기화
            $('#warningType').val('');
            $('#warningDetail').val('');
            $('#deleteContent').prop('checked', false);
            $('#restrictUser').prop('checked', false);
        });

        // 차단 버튼 클릭 시
        $('#bulkBlock').on('click', function() {
            const selectedRows = $('.row-checkbox:checked').closest('tr');
            if (selectedRows.length > 0) {
                Swal.fire({
                    title: '오디오 차단',
                    text: `선택한 ${selectedRows.length}개의 오디오를 차단하시겠습니까?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '차단',
                    cancelButtonText: '취소',
                    confirmButtonColor: '#dc3545'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $(selectedRows).each(function() {
                            $(this).find('.content-status-badge')
                                .removeClass('status-active status-warning status-deleted')
                                .addClass('status-blocked')
                                .text('차단');
                        });
                        if (typeof CheckboxManager !== 'undefined') {
                            CheckboxManager.updateSelectedCount();
                        }
                        Swal.fire('완료', '선택한 오디오가 차단되었습니다.', 'success');
                    }
                });
            }
        });

        // 삭제 버튼 클릭 시
        $('#bulkDelete').on('click', function() {
            const selectedRows = $('.row-checkbox:checked').closest('tr');
            if (selectedRows.length > 0) {
                Swal.fire({
                    title: '오디오 삭제',
                    text: `선택한 ${selectedRows.length}개의 오디오를 삭제하시겠습니까?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '삭제',
                    cancelButtonText: '취소',
                    confirmButtonColor: '#dc3545'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $(selectedRows).each(function() {
                            $(this).find('.content-status-badge')
                                .removeClass('status-active status-warning status-blocked')
                                .addClass('status-deleted')
                                .text('삭제');
                        });
                        if (typeof CheckboxManager !== 'undefined') {
                            CheckboxManager.updateSelectedCount();
                        }
                        Swal.fire('완료', '선택한 오디오가 삭제되었습니다.', 'success');
                    }
                });
            }
        });

        // 개별 행 버튼 이벤트
        $('.audio-table').on('click', '.btn-warning', function() {
            const row = $(this).closest('tr');
            $('#warningModal').modal('show');
        });

        $('.audio-table').on('click', '.btn-block', function() {
            const row = $(this).closest('tr');
            Swal.fire({
                title: '오디오 차단',
                text: '이 오디오를 차단하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '차단',
                cancelButtonText: '취소',
                confirmButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    $(row).find('.content-status-badge')
                        .removeClass('status-active status-warning status-deleted')
                        .addClass('status-blocked')
                        .text('차단');
                    Swal.fire('완료', '오디오가 차단되었습니다.', 'success');
                }
            });
        });

        $('.audio-table').on('click', '.btn-delete', function() {
            const row = $(this).closest('tr');
            Swal.fire({
                title: '오디오 삭제',
                text: '이 오디오를 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                confirmButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    $(row).find('.content-status-badge')
                        .removeClass('status-active status-warning status-blocked')
                        .addClass('status-deleted')
                        .text('삭제');
                    Swal.fire('완료', '오디오가 삭제되었습니다.', 'success');
                }
            });
        });
    }
};

// 초기화
$(document).ready(function() {
    AudioContent.init();
}); 