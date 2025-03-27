document.addEventListener('DOMContentLoaded', () => {
    // Quill 에디터 초기화
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['clean']
            ]
        },
        placeholder: '내용을 입력하세요...'
    });

    // URL에서 게시글 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // 기존 게시글 데이터 불러오기
    const loadPostData = () => {
        // 실제 구현시에는 서버에서 데이터를 가져와야 합니다
        // 여기서는 예시 데이터를 사용합니다
        const dummyData = {
            category: '연애상담',
            title: '첫 데이트 장소 추천해주세요!',
            content: '다음 주에 처음으로 데이트를 하기로 했는데, 어디로 가면 좋을까요?<br>서울 강남 근처에서 만나기로 했습니다.',
            files: [
                { name: 'map.jpg', url: '#' }
            ]
        };

        // 폼에 데이터 설정
        document.getElementById('category').value = dummyData.category;
        document.getElementById('title').value = dummyData.title;
        quill.root.innerHTML = dummyData.content;

        // 기존 파일 목록 표시
        const existingFiles = document.getElementById('existingFiles');
        dummyData.files.forEach(file => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${file.name}</span>
                <button type="button" class="remove-file" data-file="${file.name}">삭제</button>
            `;
            existingFiles.appendChild(li);
        });
    };

    // 페이지 로드시 데이터 불러오기
    loadPostData();

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

    // 기존 파일 삭제 처리
    document.getElementById('existingFiles').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file')) {
            if (confirm('파일을 삭제하시겠습니까?')) {
                e.target.closest('li').remove();
            }
        }
    });

    // 폼 제출 처리
    const editForm = document.getElementById('editForm');
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('category', document.getElementById('category').value);
        formData.append('title', document.getElementById('title').value);
        formData.append('content', quill.root.innerHTML);
        
        // 새로 추가된 파일들
        Array.from(fileInput.files).forEach(file => {
            formData.append('files[]', file);
        });

        try {
            // 여기에 서버로 데이터를 전송하는 코드 추가
            // const response = await fetch('/api/posts/' + postId, {
            //     method: 'PUT',
            //     body: formData
            // });

            alert('게시글이 수정되었습니다.');
            window.location.href = `post-detail.html?id=${postId}`;
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    });

    // 드래그 앤 드롭 파일 업로드
    const dropZone = document.querySelector('.file-upload');
    
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
}); 