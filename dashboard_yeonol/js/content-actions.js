// content-actions.js
// jQuery가 로드될 때까지 대기
document.addEventListener('DOMContentLoaded', function() {
    const CommonAlerts = {
        showWarning: function(rows) {
            window.selectedRowsForWarning = rows;
            $('#warningModal').modal('show');
        },

        showBlock: function(rows) {
            Swal.fire({
                title: '콘텐츠 차단',
                text: '선택한 콘텐츠를 차단하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '차단',
                cancelButtonText: '취소',
                confirmButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    $(rows).each(function() {
                        $(this).find('.content-status-badge')
                            .removeClass('status-active status-warning status-deleted')
                            .addClass('status-blocked')
                            .text('차단');
                    });
                    if (typeof CheckboxManager !== 'undefined') {
                        CheckboxManager.updateSelectedCount();
                    }
                    Swal.fire('완료', '선택한 콘텐츠가 차단되었습니다.', 'success');
                }
            });
        },

        showDelete: function(rows) {
            Swal.fire({
                title: '콘텐츠 삭제',
                text: '선택한 콘텐츠를 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                confirmButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    $(rows).each(function() {
                        $(this).find('.content-status-badge')
                            .removeClass('status-active status-warning status-blocked')
                            .addClass('status-deleted')
                            .text('삭제');
                    });
                    if (typeof CheckboxManager !== 'undefined') {
                        CheckboxManager.updateSelectedCount();
                    }
                    Swal.fire('완료', '선택한 콘텐츠가 삭제되었습니다.', 'success');
                }
            });
        }
    };

    const ContentActions = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // 개별 행 버튼 이벤트
            $(document).on('click', '.btn-warning', function() {
                const row = $(this).closest('tr');
                CommonAlerts.showWarning([row]);
            });

            $(document).on('click', '.btn-block', function() {
                const row = $(this).closest('tr');
                CommonAlerts.showBlock([row]);
            });

            $(document).on('click', '.btn-delete', function() {
                const row = $(this).closest('tr');
                CommonAlerts.showDelete([row]);
            });

            // 벌크 액션 버튼 이벤트
            $('#bulkWarning').on('click', function() {
                const selectedRows = $('.row-checkbox:checked').closest('tr');
                if (selectedRows.length > 0) {
                    CommonAlerts.showWarning(selectedRows);
                }
            });

            $('#bulkBlock').on('click', function() {
                const selectedRows = $('.row-checkbox:checked').closest('tr');
                if (selectedRows.length > 0) {
                    CommonAlerts.showBlock(selectedRows);
                }
            });

            $('#bulkDelete').on('click', function() {
                const selectedRows = $('.row-checkbox:checked').closest('tr');
                if (selectedRows.length > 0) {
                    CommonAlerts.showDelete(selectedRows);
                }
            });

            // 경고 모달의 발송 버튼 이벤트
            $('#sendWarningBtn').on('click', function() {
                const warningType = $('#warningType').val();
                
                if (!warningType) {
                    Swal.fire('오류', '경고 유형을 선택해주세요.', 'error');
                    return;
                }

                if (window.selectedRowsForWarning) {
                    $(window.selectedRowsForWarning).each(function() {
                        $(this).find('.content-status-badge')
                            .removeClass('status-active status-blocked status-deleted')
                            .addClass('status-warning')
                            .text('경고');
                    });
                }

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
                
                // 전역 변수 초기화
                window.selectedRowsForWarning = null;
            });
        }
    };

    // 전역 객체로 노출
    window.CommonAlerts = CommonAlerts;
    window.ContentActions = ContentActions;

    // jQuery가 로드되었는지 확인 후 초기화
    if (typeof jQuery !== 'undefined') {
        ContentActions.init();
    } else {
        console.error('jQuery is not loaded');
    }
}); 