document.addEventListener('DOMContentLoaded', () => {
    // Lightbox 설정
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': "이미지 %1 / %2"
    });

    // 필터 기능
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성 버튼 변경
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');

            const filter = button.dataset.filter;

            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 더보기 기능
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentItems = 6;
    
    loadMoreBtn.addEventListener('click', () => {
        const array = [...document.querySelectorAll('.gallery-item')];
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

        for (let i = currentItems; i < currentItems + 6; i++) {
            if (array[i]) {
                if (activeFilter === 'all' || array[i].dataset.category === activeFilter) {
                    array[i].style.display = 'block';
                }
            }
        }
        currentItems += 6;

        // 모든 아이템이 표시되면 버튼 숨기기
        if (currentItems >= array.length) {
            loadMoreBtn.style.display = 'none';
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
}); 