document.addEventListener('DOMContentLoaded', () => {
    // 탭 메뉴 기능
    const menuItems = document.querySelectorAll('.cs-menu li');
    const tabContents = document.querySelectorAll('.cs-tab-content');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // 현재 활성화된 메뉴 비활성화
            document.querySelector('.cs-menu li.active').classList.remove('active');
            // 클릭한 메뉴 활성화
            this.classList.add('active');

            // 현재 활성화된 탭 콘텐츠 비활성화
            document.querySelector('.cs-tab-content.active').classList.remove('active');
            // 클릭한 메뉴에 해당하는 탭 콘텐츠 활성화
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // FAQ 아코디언 기능
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // 현재 아코디언 상태 토글
            accordion.classList.toggle('active');
            
            // 아이콘 변경
            const icon = header.querySelector('.accordion-icon');
            icon.textContent = accordion.classList.contains('active') ? '×' : '+';
        });
    });

    // FAQ 카테고리 필터링
    const categoryButtons = document.querySelectorAll('.faq-categories button');
    const faqItems = document.querySelectorAll('.accordion');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성 버튼 변경
            document.querySelector('.faq-categories button.active').classList.remove('active');
            button.classList.add('active');
            
            const category = button.textContent;
            
            faqItems.forEach(item => {
                const itemCategory = item.querySelector('.faq-category').textContent;
                
                if (category === '전체' || category === itemCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // FAQ 검색 기능
    const searchInput = document.querySelector('.cs-search input');
    const searchButton = document.querySelector('.cs-search button');
    
    const searchFaq = () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        faqItems.forEach(item => {
            const question = item.querySelector('h4').textContent.toLowerCase();
            const answer = item.querySelector('.accordion-content p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };
    
    searchButton.addEventListener('click', searchFaq);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchFaq();
        }
    });

    // 문의하기 폼 제출
    const inquiryForm = document.querySelector('.inquiry-form');
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 폼 데이터 수집
            const inquiryType = document.getElementById('inquiry-type').value;
            const inquiryTitle = document.getElementById('inquiry-title').value;
            const inquiryContent = document.getElementById('inquiry-content').value;
            const inquiryFile = document.getElementById('inquiry-file').files;
            
            // 여기서 서버로 데이터를 전송하는 코드를 추가할 수 있습니다
            
            alert('문의가 정상적으로 접수되었습니다.');
            inquiryForm.reset();
            
            // 문의내역 탭으로 이동
            document.querySelector('[data-tab="inquiry-list"]').click();
        });
    }
}); 