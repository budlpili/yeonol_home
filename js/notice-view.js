document.addEventListener('DOMContentLoaded', function() {
    // URL에서 공지사항 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const noticeId = urlParams.get('id');

    // 공지사항 데이터 로드
    loadNoticeData(noticeId);

    // 이전/다음글 클릭 이벤트
    setupNavigation();
});

function loadNoticeData(noticeId) {
    // TODO: API 호출로 실제 데이터 로드
    // 임시 데이터 사용
    const noticeData = {
        title: '[중요] 개인정보 처리방침 개정 안내',
        date: '2024.03.15',
        views: 1234,
        content: `안녕하세요, 여놀입니다.

개인정보 보호법 개정에 따라 개인정보 처리방침이 변경되었음을 알려드립니다.

주요 변경사항:
- 개인정보 수집 및 이용 목적 명확화
- 개인정보 보유기간 상세화
- 개인정보 제3자 제공 현황 추가

자세한 내용은 첨부된 파일을 참고해 주시기 바랍니다.`,
        files: [
            {
                name: '개인정보처리방침_변경사항.pdf',
                size: '2.5MB',
                type: 'pdf'
            }
        ],
        prevNotice: {
            id: 9,
            title: '앱 버전 2.0 업데이트 안내'
        },
        nextNotice: {
            id: 8,
            title: '서비스 점검 안내 (03/05 02:00~04:00)'
        }
    };

    // 데이터 표시
    displayNoticeData(noticeData);
}

function displayNoticeData(data) {
    // 제목 표시
    document.querySelector('.notice-title').textContent = data.title;
    
    // 메타 정보 표시
    document.querySelector('.notice-date').textContent = data.date;
    document.querySelector('.notice-views').textContent = `조회수: ${data.views}`;
    
    // 내용 표시
    document.querySelector('.notice-content').innerHTML = data.content.replace(/\n/g, '<br>');
    
    // 첨부파일 표시
    const filesList = document.querySelector('.notice-files ul');
    filesList.innerHTML = data.files.map(file => `
        <li>
            <i class="fas fa-file-${file.type}"></i>
            <a href="#">${file.name}</a>
            <span class="file-size">(${file.size})</span>
        </li>
    `).join('');
    
    // 이전/다음글 링크 설정
    document.querySelector('.prev a').textContent = data.prevNotice.title;
    document.querySelector('.prev a').href = `notice-view.html?id=${data.prevNotice.id}`;
    document.querySelector('.next a').textContent = data.nextNotice.title;
    document.querySelector('.next a').href = `notice-view.html?id=${data.nextNotice.id}`;
}

function setupNavigation() {
    // 이전/다음글 클릭 이벤트
    document.querySelectorAll('.prev-next a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const noticeId = this.getAttribute('href').split('=')[1];
            loadNoticeData(noticeId);
            // URL 업데이트
            window.history.pushState({}, '', `notice-view.html?id=${noticeId}`);
        });
    });
} 