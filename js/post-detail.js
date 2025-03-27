document.addEventListener('DOMContentLoaded', () => {
    // 좋아요 버튼 기능
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('active');
            const likeCount = likeBtn.querySelector('span');
            const currentCount = parseInt(likeCount.textContent.split(' ')[1]);
            likeCount.textContent = `좋아요 ${likeBtn.classList.contains('active') ? currentCount + 1 : currentCount - 1}`;
        });
    }

    // 댓글 등록 기능
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

    // 댓글 삭제 기능
    const commentList = document.querySelector('.comment-list');
    if (commentList) {
        commentList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                if (confirm('댓글을 삭제하시겠습니까?')) {
                    const comment = e.target.closest('.comment');
                    if (comment) {
                        comment.remove();
                        
                        // 댓글 수 업데이트
                        const commentCount = document.querySelector('.comment-count');
                        if (commentCount) {
                            commentCount.textContent = parseInt(commentCount.textContent) - 1;
                        }
                    }
                }
            }
        });
    }
    // 게시글 삭제 기능
    const deletePostBtn = document.querySelector('.post-actions .delete-btn');
    if (deletePostBtn) {
        deletePostBtn.addEventListener('click', () => {
            if (confirm('게시글을 삭제하시겠습니까?')) {
                // 실제 구현시에는 서버에 삭제 요청을 보내야 함
                window.location.href = '../board_com/community.html';
            }
        });
    }
}); 