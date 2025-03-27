document.addEventListener('DOMContentLoaded', () => {
    // Quill 에디터 설정
    const toolbarOptions = {
        container: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
        ],
        handlers: {
            image: imageHandler
        }
    };

    // Quill 에디터 초기화
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: '내용을 입력하세요...',
        bounds: '#editor-container'
    });

    // 이미지 핸들러 함수
    function imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // 에디터 변경 감지를 위한 MutationObserver 설정
    const editorContainer = document.querySelector('#editor-container');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 에디터 내용이 변경됨
                console.log('Editor content changed');
            }
        });
    });

    observer.observe(editorContainer, {
        childList: true,
        subtree: true
    });

    // 파일 업로드 처리
    const fileInput = document.getElementById('file');
    const filePreview = document.querySelector('.file-preview');

    fileInput.addEventListener('change', (e) => {
        filePreview.innerHTML = '';
        
        Array.from(e.target.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    filePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            } else {
                const fileInfo = document.createElement('div');
                fileInfo.className = 'file-info';
                fileInfo.textContent = file.name;
                filePreview.appendChild(fileInfo);
            }
        });
    });

    // 폼 제출 처리
    const writeForm = document.getElementById('writeForm');
    if (writeForm) {
        writeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('category', document.getElementById('category').value);
            formData.append('title', document.getElementById('title').value);
            formData.append('content', quill.root.innerHTML);
            
            Array.from(fileInput.files).forEach(file => {
                formData.append('files[]', file);
            });

            try {
                // 여기에 서버로 데이터를 전송하는 코드 추가
                console.log('폼 데이터:', Object.fromEntries(formData));
                alert('게시글이 등록되었습니다.');
                window.location.href = 'community.html';
            } catch (error) {
                console.error('Error:', error);
                alert('게시글 등록에 실패했습니다.');
            }
        });
    }

    // 드래그 앤 드롭 처리
    const dropZone = document.querySelector('.file-upload');
    if (dropZone) {
        ['dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropZone.addEventListener('dragover', () => {
            dropZone.style.backgroundColor = '#f8f9fa';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.backgroundColor = 'transparent';
        });

        dropZone.addEventListener('drop', (e) => {
            dropZone.style.backgroundColor = 'transparent';
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        });
    }
}); 