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

    // 스크롤 애니메이션 처리
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animated');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // 요소가 화면에 보일 때 애니메이션 클래스 추가
            if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.visibility = 'visible';
            }
        });
    };

    // 초기 애니메이션 상태 설정
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        element.style.visibility = 'hidden';
    });

    // 스크롤 이벤트에 애니메이션 처리 추가
    window.addEventListener('scroll', animateOnScroll);
    // 페이지 로드 시에도 애니메이션 체크
    window.addEventListener('load', animateOnScroll);
    // 초기 로드 시에도 한 번 체크
    animateOnScroll();

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

    // 이미지 스크롤 애니메이션
    function handleDescriptionCardsAnimation() {
        const imageContainers = document.querySelectorAll('.daily-img-container');
        
        imageContainers.forEach(container => {
            const containerTop = container.getBoundingClientRect().top;
            const containerBottom = container.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // 컨테이너가 화면에 보일 때 이미지 애니메이션 실행
            if (containerTop < windowHeight * 0.8 && containerBottom > 0) {
                const images = container.querySelectorAll('img:not(:nth-child(1))');
                images.forEach((img, index) => {
                    setTimeout(() => {
                        img.classList.add('visible');
                    }, index * 400); // 각 이미지마다 400ms 딜레이 추가
                });
            }
        });
    }

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleDescriptionCardsAnimation);
    // 페이지 로드 시에도 체크
    window.addEventListener('load', handleDescriptionCardsAnimation);
    // 초기 로드 시에도 한 번 체크
    handleDescriptionCardsAnimation();
});