document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('imageDropZone');
    const fileInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('imagePreview');
    const form = document.getElementById('galleryWriteForm');

    // 드래그 앤 드롭 이벤트
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
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    // 파일 드롭 처리
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // 파일 입력 처리
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        [...files].forEach(file => {
            if (validImageTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'image-preview';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image">×</button>
                    `;
                    previewContainer.appendChild(preview);

                    // 이미지 삭제 버튼
                    preview.querySelector('.remove-image').addEventListener('click', function() {
                        preview.remove();
                    });
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('유효하지 않은 파일입니다. JPG 또는 PNG 파일(최대 5MB)만 업로드 가능합니다.');
            }
        });
    }

    // 폼 제출
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const images = document.querySelectorAll('.image-preview img');
        
        if (images.length === 0) {
            alert('최소 1개의 이미지를 업로드해주세요.');
            return;
        }

        try {
            // 여기에 서버로 데이터를 전송하는 코드 추가
            // const response = await fetch('/api/gallery', {
            //     method: 'POST',
            //     body: formData
            // });

            alert('게시글이 등록되었습니다.');
            window.location.href = '../board_gallery/gallery.html';
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 등록에 실패했습니다.');
        }
    });

    // 태그 입력 처리
    const tagsInput = document.getElementById('tags');
    tagsInput.addEventListener('input', function() {
        let value = this.value;
        if (!value.startsWith('#')) {
            this.value = '#' + value;
        }
        this.value = this.value.replace(/\s+/g, ' #');
    });
}); 