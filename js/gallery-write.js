document.addEventListener('DOMContentLoaded', () => {
    // 필수 요소들 확인
    const dropZone = document.getElementById('imageDropZone');
    const fileInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('imagePreview');
    const form = document.getElementById('galleryWriteForm');
    const editor = document.getElementById('editor');
    const tagsInput = document.getElementById('tags');

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
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image']
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
    if (dropZone && fileInput && previewContainer) {
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
        fileInput.addEventListener('change', function () {
            handleFiles(this.files);
        });

        function handleFiles(files) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const currentImages = document.querySelectorAll('.image-preview img').length;
            const remainingSlots = 3 - currentImages;

            if (files.length > remainingSlots) {
                Swal.fire({
                    title: '이미지 개수 초과',
                    text: `최대 3개의 이미지만 업로드 가능합니다. (현재 ${currentImages}개 업로드됨)`,
                    icon: 'warning',
                    confirmButtonText: '확인'
                });
                return;
            }

            [...files].forEach(file => {
                if (validImageTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        const preview = document.createElement('div');
                        preview.className = 'image-preview';
                        preview.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-image">×</button>
                        `;
                        previewContainer.appendChild(preview);

                        // 이미지 삭제 버튼
                        preview.querySelector('.remove-image').addEventListener('click', function () {
                            Swal.fire({
                                title: '이미지를 삭제하시겠습니까?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: '삭제',
                                cancelButtonText: '취소'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    preview.remove();
                                    // 이미지가 모두 삭제되면 드롭존 표시
                                    const currentImages = document.querySelectorAll('.image-preview img').length;
                                    dropZone.style.display = currentImages >= 3 ? 'none' : 'flex';
                                }
                            });
                        });

                        // 이미지가 3개가 되면 드롭존 숨기기
                        const totalImages = document.querySelectorAll('.image-preview img').length;
                        dropZone.style.display = totalImages >= 3 ? 'none' : 'flex';
                    };

                    reader.readAsDataURL(file);
                } else {
                    Swal.fire({
                        title: '유효하지 않은 파일',
                        text: 'JPG 또는 PNG 파일(최대 5MB)만 업로드 가능합니다.',
                        icon: 'error',
                        confirmButtonText: '확인'
                    });
                }
            });
        }
    }

    // 폼 제출
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const images = document.querySelectorAll('.image-preview img');

            // 에디터 내용 추가
            formData.append('content', quill.root.innerHTML);

            if (images.length === 0) {
                // 이미지가 없는 경우 확인 알림창 표시
                Swal.fire({
                    title: '이미지 없이 등록하시겠습니까?',
                    text: '최소 1개의 이미지 업로드를 권장합니다.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '등록',
                    cancelButtonText: '취소',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33'
                }).then((result) => {
                    if (result.isConfirmed) {
                        submitForm(formData);
                    }
                });
            } else {
                submitForm(formData);
            }
        });
    }

    // 폼 제출 함수
    async function submitForm(formData) {
        try {
            // 여기에 서버로 데이터를 전송하는 코드 추가
            // const response = await fetch('/api/gallery', {
            //     method: 'POST',
            //     body: formData
            // });

            Swal.fire({
                title: '성공!',
                text: '게시글이 등록되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '../board_gallery/gallery.html';
                }
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: '오류 발생',
                text: '게시글 등록에 실패했습니다.',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
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
                    window.location.href = '../board_gallery/gallery.html';
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

    // 태그 입력 처리
    if (tagsInput) {
        tagsInput.addEventListener('input', function () {
            let value = this.value;
            if (!value.startsWith('#')) {
                this.value = '#' + value;
            }
            this.value = this.value.replace(/\s+/g, ' #');
        });
    }
}); 