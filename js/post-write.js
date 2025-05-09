document.addEventListener('DOMContentLoaded', () => {
    // 필수 요소들 확인
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('file');
    const filePreview = document.querySelector('.file-preview');
    const form = document.getElementById('writeForm');
    const editor = document.getElementById('editor');

    // 필수 요소가 없는 경우 실행 중단
    if (!editor) {
        console.error('Editor element not found');
        return;
    }

    // Quill 에디터 초기화
    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: '내용을 입력하세요...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        },
        bounds: editor.parentElement
    });

    // MutationObserver를 사용하여 에디터 내용 변경 감지
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const content = quill.root.innerHTML;
                // 필요한 경우 여기서 추가 작업 수행
            }
        });
    });

    observer.observe(quill.root, {
        childList: true,
        subtree: true
    });

    // 파일 업로드 관련 요소가 있는 경우에만 이벤트 리스너 추가
    if (dropZone && fileInput && filePreview) {
        const MAX_FILES = 3;

        // 드래그&드롭 이벤트
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('dragover');
            }, false);
        });

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
            const currentFiles = filePreview.querySelectorAll('.file-item').length;
            const remainingSlots = MAX_FILES - currentFiles;

            if (files.length > remainingSlots) {
                Swal.fire({
                    title: '파일 개수 초과',
                    text: `최대 ${MAX_FILES}개 파일만 첨부할 수 있습니다.`,
                    icon: 'warning',
                    confirmButtonText: '확인'
                });
                return;
            }

            [...files].forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                const reader = new FileReader();

                if (file.type.startsWith('image/')) {
                    reader.onload = function(e) {
                        fileItem.innerHTML = `
                            <div class="file-preview-container">
                                <img src="${e.target.result}" alt="${file.name}" class="file-image">
                                <button type="button" class="remove-file"><i class="fas fa-times"></i></button>
                                <span class="file-name">${file.name}</span>
                            </div>
                        `;
                    };
                    reader.readAsDataURL(file);
                } else {
                    fileItem.innerHTML = `
                        <div class="file-preview-container">
                            <i class="fas fa-file"></i>
                            <button type="button" class="remove-file"><i class="fas fa-times"></i></button>
                            <span class="file-name">${file.name}</span>
                        </div>
                    `;
                }
                filePreview.appendChild(fileItem);
            });

            // 파일 개수 제한 시 input 비활성화
            setTimeout(() => {
                const totalFiles = filePreview.querySelectorAll('.file-item').length;
                fileInput.disabled = totalFiles >= MAX_FILES;
            }, 100);
        }

        // 파일 삭제
        filePreview.addEventListener('click', function(e) {
            const removeBtn = e.target.closest('.remove-file');
            if (!removeBtn) return;

            const fileItem = removeBtn.closest('.file-item');
            Swal.fire({
                title: '파일 삭제',
                text: '파일을 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '삭제',
                cancelButtonText: '취소'
            }).then(result => {
                if (result.isConfirmed) {
                    fileItem.remove();
                    // 파일 개수 제한 해제
                    const totalFiles = filePreview.querySelectorAll('.file-item').length;
                    fileInput.disabled = totalFiles >= MAX_FILES;
                    Swal.fire({
                        title: '삭제 완료!',
                        text: '파일이 삭제되었습니다.',
                        icon: 'success',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#3085d6'
                    });
                }
            });
        });
    }

    // 폼 제출
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const category = document.getElementById('category')?.value;
            const title = document.getElementById('title')?.value;
            const content = quill.root.innerHTML;

            if (!category) {
                Swal.fire('카테고리 선택', '카테고리를 선택해주세요.', 'warning');
                return;
            }
            if (!title?.trim()) {
                Swal.fire('제목 입력', '제목을 입력해주세요.', 'warning');
                return;
            }
            if (!content.trim() || content === '<p><br></p>') {
                Swal.fire('내용 입력', '내용을 입력해주세요.', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('category', category);
            formData.append('title', title);
            formData.append('content', content);

            // 첨부파일
            if (fileInput && filePreview) {
                const fileItems = filePreview.querySelectorAll('.file-item');
                const files = fileInput.files;
                const fileNames = Array.from(fileItems).map(item => item.querySelector('.file-name').textContent);
                
                Array.from(files).forEach(file => {
                    if (fileNames.includes(file.name)) {
                        formData.append('files[]', file);
                    }
                });
            }

            try {
                // 서버 전송 코드 위치
                await Swal.fire({
                    title: '성공!',
                    text: '게시글이 저장되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#3085d6'
                });
                window.location.href = 'community.html';
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: '오류!',
                    text: '게시글 저장에 실패했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#3085d6'
                });
            }
        });
    }

    // 취소 버튼 이벤트 핸들러
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            Swal.fire({
                title: '작성을 취소하시겠습니까?',
                text: '작성 중인 내용이 저장되지 않습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '취소',
                cancelButtonText: '돌아가기'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'community.html';
                }
            });
        });
    }

    // 수정 버튼 이벤트 핸들러
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
                title: '게시글을 수정하시겠습니까?',
                text: '수정된 내용은 즉시 반영됩니다.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '수정',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 폼 제출
                    const form = document.getElementById('postEditForm');
                    if (form) {
                        form.submit();
                    }
                }
            });
        });
    }
}); 