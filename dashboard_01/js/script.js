const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
const sideBar = document.querySelector('.sidebar');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');

menuBar.addEventListener('click', () => {
    fetch('/toggleSidebar').then(() => {
        sideBar.classList.toggle('close');
    });
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});


// coupon.html user-check all
function selectAll(selectAll)  {
    const checkboxes 
         = document.getElementsByName('user_one');
    
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked;
    })

    getCheckedCnt();

  }

// coupon.html user-check count
function getCheckedCnt()  {
    // 선택된 목록 가져오기
    const query = 'input[name="user_one"]:checked';
    const selectedElements = 
        document.querySelectorAll(query);
    
    // 선택된 목록의 갯수 세기
    const selectedElementsCnt =
          selectedElements.length;
    
    // 출력
    document.getElementById('user_result').innerText
      = selectedElementsCnt;
  }


  // coupon button active
  function change_btn(e) {
    let btns = document.querySelectorAll(".coupon");
    btns.forEach(function (btn) {
      if (e.currentTarget == btn) {
        btn.classList.add("active_color");
      } else {
        btn.classList.remove("active_color");
      }
    });
    console.log(e.currentTarget);
  }

// guide.html 관련 기능
function initGuidePage() {
    // 전체 선택 체크박스 기능
    const allCheck = document.querySelector('.all-check');
    if (allCheck) {
        allCheck.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.one-check');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 가이드 수정/삭제 기능
    const statusButtons = document.querySelectorAll('.status');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('completed')) {
                // 수정 기능
                alert('수정 기능이 실행됩니다.');
            } else if (this.classList.contains('danger')) {
                // 삭제 기능
                if (confirm('이 가이드를 삭제하시겠습니까?')) {
                    this.closest('tr').remove();
                    alert('삭제되었습니다.');
                }
            }
        });
    });

    // 검색 기능
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchText = document.querySelector('.input-search').value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const title = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if (title.includes(searchText) || category.includes(searchText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 가이드 등록 기능
    const editorBtn = document.querySelector('.editor-btn');
    if (editorBtn) {
        editorBtn.addEventListener('click', function() {
            const category = document.querySelector('.dropbtn_content').textContent;
            const title = document.querySelector('.class-title').value;
            const content = document.querySelector('#text-input').innerHTML;
            
            if (!title) {
                alert('제목을 입력해주세요.');
                return;
            }
            
            if (!content) {
                alert('내용을 입력해주세요.');
                return;
            }
            
            // 새로운 행 추가
            const tbody = document.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="checkbox" class="one-check"></td>
                <td class="event">${category}</td>
                <td>${title}</td>
                <td>${new Date().toLocaleString()}</td>
                <td><span class="status completed">수정</span>
                    <span class="status danger">삭제</span>
                </td>
            `;
            
            tbody.insertBefore(newRow, tbody.firstChild);
            
            // 입력 필드 초기화
            document.querySelector('.class-title').value = '';
            document.querySelector('#text-input').innerHTML = '';
            
            alert('가이드가 등록되었습니다.');
        });
    }

    // 드롭다운 메뉴 기능
    const dropdownBtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dataclassItems = document.querySelectorAll('.dataclass');

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
        });

        // 드롭다운 외부 클릭 시 닫기
        document.addEventListener('click', function(event) {
            if (!dropdownBtn.contains(event.target)) {
                dropdownContent.classList.remove('show');
            }
        });

        // 분류 선택 시
        dataclassItems.forEach(item => {
            item.addEventListener('click', function() {
                document.querySelector('.dropbtn_content').textContent = this.textContent;
                dropdownContent.classList.remove('show');
            });
        });
    }
}

// 페이지 로드 시 가이드 페이지 초기화
if (document.querySelector('.guide-management')) {
    initGuidePage();
}

// sp_users.html 관련 기능
function initSpUsersPage() {
    // DataTable 초기화
    $(document).ready(function() {
        new DataTable('#myTable', {
            responsive: true
        });
    });

    // 전체 선택 체크박스 기능
    const allCheck = document.querySelector('.all-check');
    if (allCheck) {
        allCheck.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.one-check');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// 페이지 로드 시 sp_users 페이지 초기화
if (document.querySelector('.user-management')) {
    initSpUsersPage();
}

// party.html 관련 기능
function initPartyPage() {
    // 전체 선택 체크박스 기능
    const allCheck = document.querySelector('.all-check');
    if (allCheck) {
        allCheck.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.one-check');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// 페이지 로드 시 party 페이지 초기화
if (document.querySelector('.party-management')) {
    initPartyPage();
}

// shorts_gram.html 관련 기능
function initShortsGramPage() {
    // 전체 선택 체크박스 기능
    document.querySelectorAll('.content-title input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const content = this.closest('.short-content, .audio-content');
            if (content) {
                content.classList.toggle('selected', this.checked);
            }
        });
    });
}

// 페이지 로드 시 shorts_gram 페이지 초기화
if (document.querySelector('.short_gram-management')) {
    initShortsGramPage();
}

// shorts_gram-list 스크롤 버튼
document.addEventListener('DOMContentLoaded', function() {
    const shortsListWrap = document.querySelector('.short_gram-list .short-list-wrap');
    const shortsScrollLeft = document.querySelector('.short_gram-list .scroll-btn.scroll-left');
    const shortsScrollRight = document.querySelector('.short_gram-list .scroll-btn.scroll-right');
    const shortsListContent = document.querySelector('.short_gram-list .short-list-content');

    if (shortsListWrap && shortsScrollLeft && shortsScrollRight && shortsListContent) {
        // 왼쪽 스크롤
        shortsScrollLeft.addEventListener('click', () => {
            shortsListContent.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });

        // 오른쪽 스크롤
        shortsScrollRight.addEventListener('click', () => {
            shortsListContent.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // 스크롤 위치에 따라 버튼 표시/숨김
        shortsListContent.addEventListener('scroll', () => {
            const isAtStart = shortsListContent.scrollLeft === 0;
            const isAtEnd = shortsListContent.scrollLeft + shortsListContent.clientWidth >= shortsListContent.scrollWidth - 1;

            shortsScrollLeft.style.display = isAtStart ? 'none' : 'flex';
            shortsScrollRight.style.display = isAtEnd ? 'none' : 'flex';
        });

        // 초기 버튼 상태 설정
        shortsScrollLeft.style.display = shortsListContent.scrollLeft === 0 ? 'none' : 'flex';
        shortsScrollRight.style.display = 'flex';
    }
});

// life_gram-list 스크롤 버튼
document.addEventListener('DOMContentLoaded', function() {
    const lifeListWrap = document.querySelector('.life_gram-list .life-list-wrap');
    const lifeScrollLeft = document.querySelector('.life_gram-list .life-scroll-btn.life-scroll-left');
    const lifeScrollRight = document.querySelector('.life_gram-list .scroll-btn.life-scroll-right');
    const lifeListContent = document.querySelector('.life_gram-list .life-list-content');

    if (lifeListWrap && lifeScrollLeft && lifeScrollRight && lifeListContent) {
        // 왼쪽 스크롤
        lifeScrollLeft.addEventListener('click', () => {
            lifeListContent.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });

        // 오른쪽 스크롤
        lifeScrollRight.addEventListener('click', () => {
            lifeListContent.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // 스크롤 위치에 따라 버튼 표시/숨김
        lifeListContent.addEventListener('scroll', () => {
            const isAtStart = lifeListContent.scrollLeft === 0;
            const isAtEnd = lifeListContent.scrollLeft + lifeListContent.clientWidth >= lifeListContent.scrollWidth - 1;

            lifeScrollLeft.style.display = isAtStart ? 'none' : 'flex';
            lifeScrollRight.style.display = isAtEnd ? 'none' : 'flex';
        });

        // 초기 버튼 상태 설정
        lifeScrollLeft.style.display = lifeListContent.scrollLeft === 0 ? 'none' : 'flex';
        lifeScrollRight.style.display = 'flex';
    }
});

// sales.html 관련 기능
function initSalesPage() {
    // 달력 타입 변경 처리
    const calendarSelect = document.getElementById('calendar');
    if (calendarSelect) {
        calendarSelect.addEventListener('change', function(event) {
            const calType = event.target.value;
            const calSpan = document.getElementById('cal');
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            
            switch(calType) {
                case 'year':
                    startDate.type = 'number';
                    endDate.type = 'number';
                    startDate.placeholder = '시작 연도';
                    endDate.placeholder = '종료 연도';
                    break;
                case 'month':
                    startDate.type = 'month';
                    endDate.type = 'month';
                    break;
                case 'week':
                    startDate.type = 'week';
                    endDate.type = 'week';
                    break;
                case 'day':
                    startDate.type = 'date';
                    endDate.type = 'date';
                    break;
            }
        });
    }

    // 날짜 유효성 검사
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (startDateInput) {
        startDateInput.addEventListener('change', function(event) {
            endDateInput.min = event.target.value;
        });
    }

    if (endDateInput) {
        endDateInput.addEventListener('change', function(event) {
            startDateInput.max = event.target.value;
        });
    }
}

// 페이지 로드 시 sales 페이지 초기화
if (document.querySelector('.sales-management')) {
    initSalesPage();
}

// coupon.html 관련 기능
function initCouponPage() {
    // DataTable 초기화
    $(document).ready(function() {
        new DataTable('#myTable', {
            responsive: true
        });
    });

    // 쿠폰 버튼 클릭 이벤트
    const couponButtons = document.querySelectorAll('.coupon');
    couponButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            couponButtons.forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
        });
    });

    // 전체 선택 체크박스
    const allCheck = document.querySelector('input[name="user_all"]');
    if (allCheck) {
        allCheck.addEventListener('change', function() {
            const checkboxes = document.getElementsByName('user_one');
            for(let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = this.checked;
            }
            getCheckedCnt();
        });
    }

    // 개별 체크박스 이벤트
    const userCheckboxes = document.getElementsByName('user_one');
    userCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', getCheckedCnt);
    });
}

// 선택된 유저 수 카운트
function getCheckedCnt() {
    const checkboxes = document.getElementsByName('user_one');
    let count = 0;
    for(let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) count++;
    }
    document.getElementById('user_result').textContent = count;
}

// 페이지 로드 시 coupon 페이지 초기화
if (document.querySelector('.coupon-management')) {
    initCouponPage();
}

// announcement.html 관련 기능
function initAnnouncementPage() {
    // Mock data for announcements
    const announcements = [
        {
            id: 1,
            category: '[ 이벤트 ]',
            title: '썸푸닝 오픈이벤트',
            date: '2024/04/01, 16:44:62'
        },
        // Add more mock data as needed
    ];

    // 페이지 초기화
    renderAnnouncements();
    setupPagination();
    setupEventListeners();

    // 검색 기능
    const searchForm = document.querySelector('form[onsubmit="return handleSearch(event)"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchInput = event.target.querySelector('input[type="search"]');
            // 검색 로직 구현
            return false;
        });
    }

    // 공지사항 검색 기능
    const announcementSearchBtn = document.querySelector('.btn-search');
    if (announcementSearchBtn) {
        announcementSearchBtn.addEventListener('click', handleAnnouncementSearch);
    }

    // 전체 선택 체크박스
    const allCheck = document.querySelector('.all-check');
    if (allCheck) {
        allCheck.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.one-check');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    // 정렬 기능
    const sortLinks = document.querySelectorAll('th.data a');
    sortLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const column = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            handleSort(column);
        });
    });

    // 드롭다운 토글
    const dropdownBtn = document.querySelector('.dropbtn_click');
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', toggleDropdown);
    }

    // 카테고리 선택
    const categoryItems = document.querySelectorAll('.dataclass');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            selectCategory(this.innerText);
        });
    });

    // 공지사항 등록
    const submitBtn = document.querySelector('.editor-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', handleAnnouncementSubmit);
    }
}

// 공지사항 검색 처리
function handleAnnouncementSearch() {
    const searchInput = document.querySelector('.input-search');
    const searchText = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('#announcementTableBody tr');
    
    rows.forEach(row => {
        const title = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        
        if (title.includes(searchText) || category.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// 정렬 처리
function handleSort(column) {
    const tbody = document.getElementById('announcementTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent;
        const bValue = b.querySelector(`td:nth-child(${getColumnIndex(column)})`).textContent;
        return aValue.localeCompare(bValue);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// 컬럼 인덱스 가져오기
function getColumnIndex(column) {
    const columnMap = {
        'name': 2,  // 분류
        'email': 3, // 제목
        'phone': 4, // 공지 일시
        'userid': 5 // 상태
    };
    return columnMap[column] || 1;
}

// 드롭다운 토글
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.classList.toggle('show');
}

// 카테고리 선택
function selectCategory(category) {
    document.querySelector('.dropbtn_content').textContent = category;
    toggleDropdown();
}

// 공지사항 등록 처리
function handleAnnouncementSubmit() {
    const category = document.querySelector('.dropbtn_content').textContent;
    const title = document.querySelector('.class-title').value;
    const content = document.getElementById('text-input').innerHTML;
    
    if (!title) {
        alert('제목을 입력해주세요.');
        return;
    }
    
    if (!content) {
        alert('내용을 입력해주세요.');
        return;
    }
    
    // 새로운 행 추가
    const tbody = document.getElementById('announcementTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="checkbox" class="one-check"></td>
        <td class="event">${category}</td>
        <td>${title}</td>
        <td>${new Date().toLocaleString()}</td>
        <td>
            <span class="status completed" onclick="handleEdit(${Date.now()})">수정</span>
            <span class="status danger" onclick="handleDelete(${Date.now()})">삭제</span>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
    
    // 입력 필드 초기화
    document.querySelector('.class-title').value = '';
    document.getElementById('text-input').innerHTML = '';
    
    alert('공지사항이 등록되었습니다.');
}

// 공지사항 렌더링
function renderAnnouncements() {
    const tbody = document.getElementById('announcementTableBody');
    if (!tbody) return;

    const announcements = [
        {
            id: 1,
            category: '[ 이벤트 ]',
            title: '썸푸닝 오픈이벤트',
            date: '2024/04/01, 16:44:62'
        }
        // Add more mock data as needed
    ];

    tbody.innerHTML = announcements.map(announcement => `
        <tr>
            <td><input type="checkbox" class="one-check"></td>
            <td class="event">${announcement.category}</td>
            <td>${announcement.title}</td>
            <td>${announcement.date}</td>
            <td>
                <span class="status completed" onclick="handleEdit(${announcement.id})">수정</span>
                <span class="status danger" onclick="handleDelete(${announcement.id})">삭제</span>
            </td>
        </tr>
    `).join('');
}

// 페이지네이션 설정
function setupPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalItems = 78;
    const itemsPerPage = 3;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === 1 ? 'active' : ''}">
                <a class="page-link" href="#" onclick="handlePageChange(${i})">${i}</a>
            </li>
        `;
    }
    
    pagination.innerHTML = paginationHTML;
}

// 페이지 변경 처리
function handlePageChange(page) {
    const paginationItems = document.querySelectorAll('.pagination .page-item');
    paginationItems.forEach(item => item.classList.remove('active'));
    paginationItems[page - 1].classList.add('active');
    
    // 페이지네이션 로직 구현
    const start = (page - 1) * 3 + 1;
    const end = Math.min(start + 2, 78);
    document.getElementById('showingRange').textContent = `${start} - ${end}`;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(event) {
        const dropdown = document.querySelector('.dropdown');
        const dropdownContent = document.querySelector('.dropdown-content');
        if (dropdown && dropdownContent && !dropdown.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
}

// 페이지 로드 시 announcement 페이지 초기화
if (document.querySelector('.announcement-management')) {
    initAnnouncementPage();
}

// report.html 관련 기능
function initReportPage() {
    // 전체 선택 체크박스 기능
    const allCheck = document.querySelector('.all-check');
    if (allCheck) {
        allCheck.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.one-check');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // 신고 메시지 전송 기능
    document.querySelectorAll('.bx-send').forEach(sendBtn => {
        sendBtn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.report-send');
            if (input.value.trim()) {
                alert('메시지가 전송되었습니다: ' + input.value);
                input.value = '';
            }
        });
    });
}

// 페이지 로드 시 report 페이지 초기화
if (document.querySelector('.report-management')) {
    initReportPage();
}

// 체크박스 선택 시 개수 업데이트
document.addEventListener('DOMContentLoaded', function() {
    // shorts-content 체크박스 카운트
    const shortsCheckboxes = document.querySelectorAll('.short-content .content-title .video-checkbox');
    const selectedCountSpan = document.querySelector('.selected-count');
    
    function updateShortsSelectedCount() {
        if (selectedCountSpan) {
            const selectedCount = document.querySelectorAll('.short-content .content-title .video-checkbox:checked').length;
            selectedCountSpan.textContent = `${selectedCount}개 선택`;
        }
    }

    // 초기 shorts 체크된 개수 표시
    updateShortsSelectedCount();

    shortsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateShortsSelectedCount);
    });

    // life-content 체크박스 카운트
    const lifeCheckboxes = document.querySelectorAll('.life-content .content-title .life-checkbox');
    const lifeSelectedCount = document.querySelector('.life-selected-count');
    
    function updateLifeSelectedCount() {
        if (lifeSelectedCount) {
            const checkedCount = document.querySelectorAll('.life-content .content-title .life-checkbox:checked').length;
            lifeSelectedCount.textContent = `${checkedCount}개 선택`;
        }
    }
    
    // 초기 life 체크된 개수 표시
    updateLifeSelectedCount();
    
    lifeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateLifeSelectedCount);
    });
});

// 스크롤 버튼 기능
document.addEventListener('DOMContentLoaded', function() {
    const listContent = document.querySelector('.list-content');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    if (listContent && scrollLeftBtn && scrollRightBtn) {
        // 스크롤 버튼 클릭 이벤트
        scrollLeftBtn.addEventListener('click', () => {
            listContent.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            listContent.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
        
        // 스크롤 위치에 따라 버튼 표시/숨김
        function updateScrollButtons() {
            const isAtStart = listContent.scrollLeft === 0;
            const isAtEnd = listContent.scrollLeft + listContent.clientWidth >= listContent.scrollWidth - 1; // 1px의 오차 허용
            
            scrollLeftBtn.classList.toggle('hidden', isAtStart);
            scrollRightBtn.classList.toggle('hidden', isAtEnd);
        }
        
        // 초기 상태 설정
        updateScrollButtons();
        
        // 스크롤 이벤트 리스너
        listContent.addEventListener('scroll', updateScrollButtons);
        
        // 리사이즈 이벤트 리스너
        window.addEventListener('resize', updateScrollButtons);
    }
});

// 비디오 재생 기능
document.addEventListener('DOMContentLoaded', function() {
    const shortItems = document.querySelectorAll('.short-item');
    
    shortItems.forEach(item => {
        const video = item.querySelector('video');
        const playButton = item.querySelector('.short-item-play');
        
        if (video && playButton) {
            playButton.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playButton.style.opacity = '0';
                } else {
                    video.pause();
                    playButton.style.opacity = '1';
                }
            });
            
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playButton.style.opacity = '0';
                } else {
                    video.pause();
                    playButton.style.opacity = '1';
                }
            });
            
            video.addEventListener('ended', () => {
                playButton.style.opacity = '1';
            });
        }
    });
});

// audio_gram-list 체크박스 갯수 표시
document.addEventListener('DOMContentLoaded', function() {
    const audioCheckboxes = document.querySelectorAll('.audio_gram-list .audio-checkbox');
    const audioSelectedCount = document.querySelector('.audio_gram-list .audio-selected-count');

    if (audioCheckboxes && audioSelectedCount) {
        // 초기 체크박스 갯수 표시
        audioSelectedCount.textContent = '0개 선택';

        // 체크박스 상태 변경 시 갯수 업데이트
        audioCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedCount = document.querySelectorAll('.audio_gram-list .audio-checkbox:checked').length;
                audioSelectedCount.textContent = `${checkedCount}개 선택`;
            });
        });
    }
});


// life_gram-list 스크롤 버튼
document.addEventListener('DOMContentLoaded', function() {
    const lifeListWrap = document.querySelector('.audio_gram-list .audio-list-wrap');
    const lifeScrollLeft = document.querySelector('.audio_gram-list .scroll-btn.audio-scroll-left');
    const lifeScrollRight = document.querySelector('.audio_gram-list .scroll-btn.audio-scroll-right');
    const lifeListContent = document.querySelector('.audio_gram-list .audio-list-content');

    if (lifeListWrap && lifeScrollLeft && lifeScrollRight && lifeListContent) {
        // 왼쪽 스크롤
        lifeScrollLeft.addEventListener('click', () => {
            lifeListContent.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });

        // 오른쪽 스크롤
        lifeScrollRight.addEventListener('click', () => {
            lifeListContent.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // 스크롤 위치에 따라 버튼 표시/숨김
        lifeListContent.addEventListener('scroll', () => {
            const isAtStart = lifeListContent.scrollLeft === 0;
            const isAtEnd = lifeListContent.scrollLeft + lifeListContent.clientWidth >= lifeListContent.scrollWidth - 1;

            lifeScrollLeft.style.display = isAtStart ? 'none' : 'flex';
            lifeScrollRight.style.display = isAtEnd ? 'none' : 'flex';
        });

        // 초기 버튼 상태 설정
        lifeScrollLeft.style.display = lifeListContent.scrollLeft === 0 ? 'none' : 'flex';
        lifeScrollRight.style.display = 'flex';
    }
});

// 메시지 버튼 새 창 열기
document.addEventListener('DOMContentLoaded', function() {
    const messageButtons = {
        'btn-message-short': 'https://open.kakao.com/your-short-link',
        'btn-message-life': 'https://open.kakao.com/your-life-link',
        'btn-message-audio': 'https://open.kakao.com/your-audio-link'
    };

    Object.entries(messageButtons).forEach(([buttonId, url]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                window.open(url, '_blank', 'width=500,height=700');
            });
        }
    });
});

// 삭제 버튼 기능
document.addEventListener('DOMContentLoaded', function() {
    // 쇼츠 삭제 버튼
    const shortsDeleteBtn = document.getElementById('btn-delete-short');
    if (shortsDeleteBtn) {
        shortsDeleteBtn.addEventListener('click', function() {
            const selectedItems = document.querySelectorAll('.short-content .content-title .video-checkbox:checked');
            if (selectedItems.length === 0) {
                alert('삭제할 항목을 선택해주세요.');
                return;
            }
            
            if (confirm(`${selectedItems.length}개의 항목을 삭제하시겠습니까?`)) {
                selectedItems.forEach(checkbox => {
                    checkbox.closest('.short-content').remove();
                });
                updateShortsSelectedCount();
                alert('선택한 항목이 삭제되었습니다.');
            }
        });
    }

    // 라이프 삭제 버튼
    const lifeDeleteBtn = document.getElementById('btn-delete-life');
    if (lifeDeleteBtn) {
        lifeDeleteBtn.addEventListener('click', function() {
            const selectedItems = document.querySelectorAll('.life-content .content-title .life-checkbox:checked');
            if (selectedItems.length === 0) {
                alert('삭제할 항목을 선택해주세요.');
                return;
            }
            
            if (confirm(`${selectedItems.length}개의 항목을 삭제하시겠습니까?`)) {
                selectedItems.forEach(checkbox => {
                    checkbox.closest('.life-content').remove();
                });
                updateLifeSelectedCount();
                alert('선택한 항목이 삭제되었습니다.');
            }
        });
    }

    // 오디오 삭제 버튼
    const audioDeleteBtn = document.getElementById('btn-delete-audio');
    if (audioDeleteBtn) {
        audioDeleteBtn.addEventListener('click', function() {
            const selectedItems = document.querySelectorAll('.audio-content .content-title .audio-checkbox:checked');
            if (selectedItems.length === 0) {
                alert('삭제할 항목을 선택해주세요.');
                return;
            }
            
            if (confirm(`${selectedItems.length}개의 항목을 삭제하시겠습니까?`)) {
                selectedItems.forEach(checkbox => {
                    checkbox.closest('.audio-content').remove();
                });
                const audioSelectedCount = document.querySelector('.audio_gram-list .audio-selected-count');
                if (audioSelectedCount) {
                    audioSelectedCount.textContent = '0개 선택';
                }
                alert('선택한 항목이 삭제되었습니다.');
            }
        });
    }
});