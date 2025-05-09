// 사이드바 토글
const sidebarToggle = document.querySelector('.nav-left i');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    content.classList.toggle('expanded');
});

// 다크 모드 토글
const themeToggle = document.querySelector('.theme-toggle input');
const body = document.body;

themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

// 저장된 테마 적용
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.checked = true;
}

// 알림 카운트 업데이트
function updateNotificationCount() {
    const count = document.querySelector('.notifications .count');
    // 실제 알림 데이터로 업데이트
    count.textContent = '3';
}

// 검색 기능
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tables = document.querySelectorAll('table tbody tr');
    
    tables.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// 인사이트 카드 데이터 업데이트 (더미 데이터)
function updateInsightCards() {
    const cards = document.querySelectorAll('.insight-card');
    cards.forEach(card => {
        const count = card.querySelector('.count');
        const value = parseInt(card.querySelector('.info p').textContent.replace(/,/g, ''));
        const change = Math.random() > 0.5 ? 1 : -1;
        const percentage = Math.floor(Math.random() * 10) + 1;
        
        count.textContent = `${change > 0 ? '+' : '-'}${percentage}%`;
        count.className = `count ${change > 0 ? 'up' : 'down'}`;
    });
}

// 테이블 데이터 업데이트 (더미 데이터)
function updateTableData() {
    const userRows = document.querySelectorAll('.recent-users table tbody tr');
    const salesRows = document.querySelectorAll('.recent-sales table tbody tr');
    
    // 사용자 상태 업데이트
    userRows.forEach(row => {
        const status = row.querySelector('.status');
        const statuses = ['active', 'pending', 'inactive'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        status.className = `status ${randomStatus}`;
        status.textContent = randomStatus === 'active' ? '활성' : 
                           randomStatus === 'pending' ? '대기' : '비활성';
    });
    
    // 판매 상태 업데이트
    salesRows.forEach(row => {
        const status = row.querySelector('.status');
        const statuses = ['completed', 'pending'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        status.className = `status ${randomStatus}`;
        status.textContent = randomStatus === 'completed' ? '완료' : '처리중';
    });
}

// 데이터 자동 업데이트 (5초마다)
setInterval(() => {
    updateInsightCards();
    updateTableData();
    updateNotificationCount();
}, 5000);

// 초기 데이터 로드
updateInsightCards();
updateTableData();
updateNotificationCount();

// 사이드바 메뉴 활성화
const menuItems = document.querySelectorAll('.side-menu li a');
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        menuItems.forEach(i => i.parentElement.classList.remove('active'));
        item.parentElement.classList.add('active');
    });
}); 