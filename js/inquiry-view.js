document.addEventListener('DOMContentLoaded', function() {
    // URL에서 문의 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryId = urlParams.get('id');

    // 문의 데이터 로드
    loadInquiryData(inquiryId);

    // 파일 삭제 버튼 이벤트
    setupFileDeleteButtons();
});

function loadInquiryData(inquiryId) {
    // TODO: API 호출로 실제 데이터 로드
    // 임시 데이터 사용
    const inquiryData = {
        type: '결제 관련',
        title: '결제가 완료되었는데 프리미엄 혜택이 적용되지 않아요',
        date: '2024.03.18',
        status: '답변대기',
        content: `안녕하세요,

어제 프리미엄 멤버십 결제를 완료했는데, 아직도 프리미엄 혜택이 적용되지 않고 있습니다.

결제 내역은 다음과 같습니다:
- 결제일시: 2024.03.18 14:30
- 결제금액: 29,000원
- 결제수단: 신용카드

빠른 확인 부탁드립니다.`,
        files: [
            {
                name: '결제_영수증.jpg',
                size: '1.2MB',
                type: 'image'
            }
        ],
        answer: {
            content: `안녕하세요, 여놀 고객센터입니다.

문의하신 내용 확인했습니다. 현재 시스템 점검으로 인해 일시적인 지연이 발생하고 있습니다.

1시간 이내에 프리미엄 혜택이 정상적으로 적용될 예정입니다.

불편을 드려 죄송합니다.`,
            date: '2024.03.18 15:30'
        }
    };

    // 데이터 표시
    displayInquiryData(inquiryData);
}

function displayInquiryData(data) {
    // 제목 섹션 표시
    document.querySelector('.inquiry-type').textContent = data.type;
    document.querySelector('.inquiry-title').textContent = data.title;
    
    // 메타 정보 표시
    document.querySelector('.inquiry-date').textContent = data.date;
    document.querySelector('.inquiry-status').textContent = data.status;
    
    // 내용 표시
    document.querySelector('.inquiry-content').innerHTML = data.content.replace(/\n/g, '<br>');
    
    // 첨부파일 표시
    const filesList = document.querySelector('.inquiry-files ul');
    filesList.innerHTML = data.files.map(file => `
        <li>
            <i class="fas fa-file-${file.type}"></i>
            <a href="#">${file.name}</a>
            <span class="file-size">(${file.size})</span>
        </li>
    `).join('');

    // 답변 표시
    const answerSection = document.querySelector('.inquiry-answer');
    if (data.answer) {
        answerSection.style.display = 'block';
        answerSection.querySelector('.answer-content').innerHTML = data.answer.content.replace(/\n/g, '<br>');
        answerSection.querySelector('.answer-date').textContent = data.answer.date;
    } else {
        answerSection.style.display = 'none';
    }
}

function setupFileDeleteButtons() {
    // 파일 삭제 버튼 이벤트
    document.querySelectorAll('.delete-file').forEach(button => {
        button.addEventListener('click', function() {
            const fileItem = this.closest('li');
            if (confirm('첨부파일을 삭제하시겠습니까?')) {
                fileItem.remove();
            }
        });
    });
} 