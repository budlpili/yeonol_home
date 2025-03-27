document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    
    // 스크롤 이벤트 처리
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 페이지 로드 시 현재 스크롤 위치 확인
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    // 모바일 메뉴 토글
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // 메뉴 항목 클릭 시 메뉴 닫기
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // 스무스 스크롤
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 이미지 레이지 로딩
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    };

    // 이미지 레이지 로딩 실행
    lazyLoadImages();

    // 페이지 상단으로 이동하는 버튼 기능
    const pageTopBtn = document.getElementById('pageTop');

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        // 현재 스크롤 위치가 100px 이상이면 버튼 표시
        if (window.scrollY > 100) {
            pageTopBtn.classList.add('show');
        } else {
            pageTopBtn.classList.remove('show');
        }
    });

    // 버튼 클릭 이벤트
    pageTopBtn.addEventListener('click', function() {
        // 부드러운 스크롤 효과로 페이지 상단으로 이동
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});