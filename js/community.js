document.addEventListener('DOMContentLoaded', () => {
    // 카테고리 버튼 클릭 이벤트
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 현재 활성화된 버튼의 active 클래스 제거
            document.querySelector('.category-btn.active').classList.remove('active');
            // 클릭된 버튼에 active 클래스 추가
            button.classList.add('active');
            // 여기에 카테고리별 게시글 필터링 로직 추가
        });
    });

    // 검색 기능
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', () => {
        const searchType = document.querySelector('select[name="search-type"]').value;
        const searchText = document.querySelector('.search-bar input').value;
        
        // 여기에 검색 로직 추가
        console.log(`검색 유형: ${searchType}, 검색어: ${searchText}`);
    });

    // 게시글 클릭 이벤트
    const postTitles = document.querySelectorAll('.col-title');
    postTitles.forEach(title => {
        title.addEventListener('click', () => {
            // 게시글 상세 페이지로 이동
            // const postId = title.closest('.board-row').dataset.postId;
            // location.href = `post-detail.html?id=${postId}`;
        });
    });

    // 페이지네이션 클릭 이벤트
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (!button.classList.contains('active')) {
                document.querySelector('.page-btn.active').classList.remove('active');
                button.classList.add('active');
                // 여기에 페이지 전환 로직 추가
            }
        });
    });
}); 