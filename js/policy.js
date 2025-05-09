// 정책 페이지 닫기 버튼 기능
document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('.close-policy');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            window.close();
        });
    }
}); 

document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reportType = document.getElementById('reportType').value;
            const reportContent = document.getElementById('reportContent').value;

            // 신고 데이터 유효성 검사
            if (!validateReport(reportType, reportContent)) {
                return;
            }

            // 신고 데이터 처리
            submitReport(reportType, reportContent);
        });
    }
});

function validateReport(type, content) {
    if (!type) {
        alert('신고 유형을 선택해주세요.');
        return false;
    }
    
    if (!content.trim()) {
        alert('신고 내용을 입력해주세요.');
        return false;
    }
    
    if (content.length < 10) {
        alert('신고 내용을 10자 이상 입력해주세요.');
        return false;
    }
    
    return true;
}

function submitReport(type, content) {
    // TODO: API 연동
    // const reportData = {
    //     type: type,
    //     content: content,
    //     timestamp: new Date().toISOString()
    // };
    
    // fetch('/api/reports', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(reportData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     handleReportResponse(data);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     alert('신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    // });

    // 임시 응답 처리
    alert('신고가 접수되었습니다. 검토 후 조치하도록 하겠습니다.');
    document.getElementById('reportForm').reset();
}

function handleReportResponse(data) {
    if (data.success) {
        alert('신고가 접수되었습니다. 검토 후 조치하도록 하겠습니다.');
        document.getElementById('reportForm').reset();
    } else {
        alert(data.message || '신고 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 초기 데이터 로드
    loadReports();

    // 검색 기능
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', handleSearch);

    // 페이지네이션
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    prevBtn.addEventListener('click', handlePrevPage);
    nextBtn.addEventListener('click', handleNextPage);
});

// 임시 데이터
const mockReports = [
    {
        id: 1,
        type: 'abuse',
        title: '욕설 사용 신고',
        author: 'user1',
        date: '2024-03-19',
        status: 'pending'
    },
    {
        id: 2,
        type: 'spam',
        title: '스팸 광고 신고',
        author: 'user2',
        date: '2024-03-18',
        status: 'processing'
    },
    {
        id: 3,
        type: 'inappropriate',
        title: '부적절한 콘텐츠 신고',
        author: 'user3',
        date: '2024-03-17',
        status: 'completed'
    }
];

let currentPage = 1;
const itemsPerPage = 10;

function loadReports() {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';

    mockReports.forEach(report => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${report.id}</td>
            <td>${getReportTypeText(report.type)}</td>
            <td><a href="report-view.html?id=${report.id}" class="report-link">${report.title}</a></td>
            <td>${report.author}</td>
            <td>${report.date}</td>
            <td><span class="status-badge status-${report.status}">${getStatusText(report.status)}</span></td>
        `;
        tbody.appendChild(tr);
    });

    updatePagination();
}

function getReportTypeText(type) {
    const types = {
        'abuse': '욕설/비방',
        'spam': '스팸/광고',
        'inappropriate': '부적절한 콘텐츠',
        'harassment': '성희롱/성추행',
        'illegal': '불법 콘텐츠'
    };
    return types[type] || type;
}

function getStatusText(status) {
    const statuses = {
        'pending': '대기중',
        'processing': '처리중',
        'completed': '처리완료'
    };
    return statuses[status] || status;
}

function handleSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;
    
    // TODO: API 연동
    console.log('Search:', searchType, searchInput);
    loadReports(); // 임시로 전체 데이터 다시 로드
}

function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadReports();
    }
}

function handleNextPage() {
    // TODO: 전체 페이지 수 확인
    currentPage++;
    loadReports();
}

function updatePagination() {
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';

    // TODO: 전체 페이지 수 계산
    const totalPages = 5; // 임시 값

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            loadReports();
        });
        pageNumbers.appendChild(button);
    }
}
