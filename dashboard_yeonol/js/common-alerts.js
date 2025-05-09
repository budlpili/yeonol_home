// 공통 알림창 관리
const CommonAlerts = {
    // 성공 알림
    showSuccess: function (message, title = '성공') {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            confirmButtonText: '확인'
        });
    },

    // 에러 알림
    showError: function (message, title = '오류') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: '확인'
        });
    },

    // 경고 알림
    showWarning: function (message, title = '경고') {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            confirmButtonText: '확인'
        });
    },

    // 확인 대화상자
    showConfirm: function (message, title = '확인') {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        });
    },

    // 삭제 확인 대화상자
    showDeleteConfirm: function (message = '정말 삭제하시겠습니까?') {
        return Swal.fire({
            icon: 'warning',
            title: '삭제 확인',
            text: message,
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        });
    }
}; 