$(document).ready(function() {
    // 필터 기능
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const itemsPerPage = 12; // 한 페이지당 12개 아이템 (4x3 그리드)
    let currentPage = 1;

    // 페이지네이션 업데이트 함수
    function updatePagination() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const filteredItems = [...galleryItems].filter(item => 
            activeFilter === 'all' || item.dataset.category === activeFilter
        );
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        
        // 페이지 번호 업데이트
        const paginationNumbers = document.querySelector('.pagination-numbers');
        paginationNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                showPage(i);
                updatePagination();
            });
            paginationNumbers.appendChild(button);
        }

        // 이전/다음 버튼 상태 업데이트
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // 페이지 표시 함수
    function showPage(page) {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        galleryItems.forEach((item, index) => {
            if (activeFilter === 'all' || item.dataset.category === activeFilter) {
                item.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 필터 버튼 이벤트
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');
            currentPage = 1;
            showPage(1);
            updatePagination();
        });
    });

    // 이전/다음 버튼 이벤트
    document.querySelector('.pagination-btn.prev').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updatePagination();
        }
    });

    document.querySelector('.pagination-btn.next').addEventListener('click', () => {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        const filteredItems = [...galleryItems].filter(item => 
            activeFilter === 'all' || item.dataset.category === activeFilter
        );
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updatePagination();
        }
    });

    // 이미지 좋아요 기능
    document.querySelector('.gallery-grid').addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.gallery-item-meta span');
        if (likeBtn && likeBtn.textContent.includes('❤️')) {
            const currentLikes = parseInt(likeBtn.textContent.split(' ')[1]);
            likeBtn.textContent = `❤️ ${currentLikes + 1}`;
        }
    });

    // 초기 페이지 로드
    showPage(1);
    updatePagination();
});