document.addEventListener('DOMContentLoaded', function() {
    // URL에서 문의 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryId = urlParams.get('id');

    // 문의 데이터 로드
    loadInquiryData(inquiryId);

    // 파일 업로드 관련 이벤트 설정
    setupFileUpload();
    
    // 폼 제출 이벤트 설정
    setupFormSubmit();
});

function loadInquiryData(inquiryId) {
    // TODO: API 호출로 실제 데이터 로드
    // 임시 데이터 사용
    const inquiryData = {
        type: 'payment',
        title: '결제가 완료되었는데 프리미엄 혜택이 적용되지 않아요',
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
        ]
    };

    // 데이터 표시
    displayInquiryData(inquiryData);
}

function displayInquiryData(data) {
    // 폼 데이터 설정
    document.getElementById('inquiry-type').value = data.type;
    document.getElementById('inquiry-title').value = data.title;
    document.getElementById('inquiry-content').value = data.content;

    // 현재 첨부파일 표시
    const currentFilesList = document.querySelector('.current-files ul');
    currentFilesList.innerHTML = data.files.map(file => `
        <li>
            <i class="fas fa-file-${file.type}"></i>
            <span>${file.name}</span>
            <button type="button" class="delete-file">
                <i class="fas fa-times"></i>
            </button>
        </li>
    `).join('');
}

function setupFileUpload() {
    const fileInput = document.getElementById('inquiry-file');
    const fileList = document.getElementById('fileList');
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    // 파일 선택 이벤트
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    // 드래그 앤 드롭 이벤트
    const dropZone = document.querySelector('.file-label');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('highlight');
    }

    function unhighlight(e) {
        dropZone.classList.remove('highlight');
    }

    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.size > maxFileSize) {
                Swal.fire({
                    icon: 'error',
                    title: '파일 크기 초과',
                    text: '파일 크기는 5MB를 초과할 수 없습니다.'
                });
                return;
            }

            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span>${file.name}</span>
                <button type="button" class="delete-file">
                    <i class="fas fa-times"></i>
                </button>
            `;

            fileList.appendChild(fileItem);

            // 삭제 버튼 이벤트
            fileItem.querySelector('.delete-file').addEventListener('click', function() {
                fileItem.remove();
            });
        });
    }
}

function setupFormSubmit() {
    const form = document.querySelector('.inquiry-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 폼 데이터 수집
        const formData = new FormData();
        formData.append('type', document.getElementById('inquiry-type').value);
        formData.append('title', document.getElementById('inquiry-title').value);
        formData.append('content', document.getElementById('inquiry-content').value);

        // 새로 추가된 파일들
        const fileInput = document.getElementById('inquiry-file');
        Array.from(fileInput.files).forEach(file => {
            formData.append('files', file);
        });

        // TODO: API 호출로 데이터 전송
        console.log('Form data:', Object.fromEntries(formData));

        // 성공 메시지 표시
        Swal.fire({
            icon: 'success',
            title: '수정 완료',
            text: '문의내역이 성공적으로 수정되었습니다.',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // 상세보기 페이지로 이동
            window.location.href = 'inquiry-view.html';
        });
    });
} 