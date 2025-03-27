document.addEventListener('DOMContentLoaded', () => {
    // 좋아요 기능
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('active');
            const likeCount = likeBtn.querySelector('span');
            const currentCount = parseInt(likeCount.textContent.split(' ')[1]);
            likeCount.textContent = `좋아요 ${likeBtn.classList.contains('active') ? currentCount + 1 : currentCount - 1}`;
        });
    }

    // 공유하기 기능
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.querySelector('.image-info h2').textContent,
                    text: document.querySelector('.description').textContent,
                    url: window.location.href
                });
            } else {
                // 클립보드에 URL 복사
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('링크가 복사되었습니다.'))
                    .catch(err => console.error('링크 복사 실패:', err));
            }
        });
    }

    // 이미지 슬라이더 기능
    initializeSlider();

    // 댓글 기능
    const commentForm = document.querySelector('.comment-write');
    if (commentForm) {
        commentForm.querySelector('.submit-comment').addEventListener('click', () => {
            const textarea = commentForm.querySelector('textarea');
            const commentText = textarea.value.trim();
            
            if (commentText) {
                // 새 댓글 엘리먼트 생성
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-info">
                        <img src="../images/profile/pro_05.png" alt="프로필" class="comment-profile">
                        <span class="comment-author">사용자</span>
                        <span class="comment-date">${new Date().toLocaleDateString()}</span>
                    </div>
                    <p class="comment-text">${commentText}</p>
                    <div class="comment-actions">
                        <button class="reply-btn">답글</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                `;

                // 댓글 목록에 추가
                document.querySelector('.comment-list').prepend(newComment);
                
                // 댓글 수 업데이트
                const commentCount = document.querySelector('.comment-count');
                commentCount.textContent = parseInt(commentCount.textContent) + 1;
                
                // 입력창 초기화
                textarea.value = '';
            }
        });
    }

    // 답글 버튼 클릭 이벤트
    document.querySelector('.comment-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('reply-btn')) {
            const comment = e.target.closest('.comment');
            const replyForm = comment.querySelector('.reply-form');
            
            // 다른 열린 답글 폼들을 모두 닫기
            document.querySelectorAll('.reply-form').forEach(form => {
                if (form !== replyForm) {
                    form.style.display = 'none';
                }
            });

            // 현재 답글 폼 토글
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        }

        // 답글 취소 버튼
        if (e.target.classList.contains('cancel-reply')) {
            const replyForm = e.target.closest('.reply-form');
            replyForm.style.display = 'none';
            replyForm.querySelector('textarea').value = '';
        }

        // 답글 등록 버튼
        if (e.target.classList.contains('submit-reply')) {
            const replyForm = e.target.closest('.reply-form');
            const textarea = replyForm.querySelector('textarea');
            const replyText = textarea.value.trim();
            
            if (replyText) {
                const comment = e.target.closest('.comment');
                const replyList = comment.querySelector('.reply-list');
                
                // 새 답글 엘리먼트 생성
                const newReply = document.createElement('div');
                newReply.className = 'comment reply';
                newReply.innerHTML = `
                    <div class="comment-info">
                        <img src="images/profile.jpg" alt="프로필" class="comment-profile">
                        <span class="comment-author">사용자</span>
                        <span class="comment-date">${new Date().toLocaleDateString()}</span>
                    </div>
                    <p class="comment-text">${replyText}</p>
                    <div class="comment-actions">
                        <button class="delete-btn">삭제</button>
                    </div>
                `;

                // 답글 목록에 추가
                replyList.appendChild(newReply);
                
                // 폼 초기화 및 숨기기
                textarea.value = '';
                replyForm.style.display = 'none';
                
                // 댓글 수 업데이트
                const commentCount = document.querySelector('.comment-count');
                commentCount.textContent = parseInt(commentCount.textContent) + 1;
            }
        }

        // 답글 삭제 버튼
        if (e.target.classList.contains('delete-btn')) {
            if (confirm('댓글을 삭제하시겠습니까?')) {
                const comment = e.target.closest('.comment');
                comment.remove();
                
                // 댓글 수 업데이트
                const commentCount = document.querySelector('.comment-count');
                commentCount.textContent = parseInt(commentCount.textContent) - 1;
            }
        }
    });

    // 게시글 삭제 기능
    const deletePostBtn = document.querySelector('.post-actions .delete-btn');
    if (deletePostBtn) {
        deletePostBtn.addEventListener('click', () => {
            if (confirm('게시글을 삭제하시겠습니까?')) {
                // 실제 구현시에는 서버에 삭제 요청을 보내야 함
                window.location.href = '../board_gallery/gallery.html';
            }
        });
    }
});

function initializeSlider() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slider = document.querySelector('.slider');
    const images = document.querySelectorAll('.main-image');
    const imageNavigation = document.querySelector('.image-navigation');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const imageCounter = document.querySelector('.image-counter');
    
    if (!slider || images.length === 0) return;

    let currentIndex = 0;
    const totalImages = images.length;

    // 슬라이더 초기 설정
    slider.style.width = `${totalImages * 100}%`;
    images.forEach(image => {
        image.style.width = `${100 / totalImages}%`;
    });

    // 이미지가 2장 이상일 때만 네비게이션 표시
    if (totalImages >= 2) {
        imageNavigation.style.display = 'flex';
        updateImageCounter();

        // 이전 버튼 클릭
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        // 다음 버튼 클릭
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalImages - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        // 터치 슬라이드 기능
        let touchStartX = 0;
        let touchEndX = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > 50) { // 최소 스와이프 거리
                if (swipeDistance > 0 && currentIndex > 0) {
                    // 오른쪽으로 스와이프 (이전 이미지)
                    currentIndex--;
                    updateSlider();
                } else if (swipeDistance < 0 && currentIndex < totalImages - 1) {
                    // 왼쪽으로 스와이프 (다음 이미지)
                    currentIndex++;
                    updateSlider();
                }
            }
        }
    } else {
        imageNavigation.style.display = 'none';
    }

    function updateSlider() {
        // 슬라이더 이동
        slider.style.transform = `translateX(-${(currentIndex * 100) / totalImages}%)`;
        
        // 버튼 상태 업데이트
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalImages - 1;
        
        // 카운터 업데이트
        updateImageCounter();
    }

    function updateImageCounter() {
        imageCounter.textContent = `${currentIndex + 1} / ${totalImages}`;
    }
} 