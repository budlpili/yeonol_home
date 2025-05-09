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
            const targetContent = document.getElementById(tabId);
            targetContent.classList.add('active');

            // 신고하기 탭인 경우 목록 표시
            if (tabId === 'report') {
                const reportList = document.getElementById('reportList');
                const reportForm = document.getElementById('reportForm');
                const reportView = document.getElementById('reportView');
                
                if (reportList) reportList.style.display = 'block';
                if (reportForm) reportForm.style.display = 'none';
                if (reportView) reportView.style.display = 'none';
            }

            // 나의 문의내역 탭인 경우 목록 표시
            if (tabId === 'inquiry-list') {
                const inquiryList = document.getElementById('inquiryList');
                const inquiryView = document.getElementById('inquiryView');
                
                if (inquiryList) inquiryList.style.display = 'block';
                if (inquiryView) inquiryView.style.display = 'none';
            }

            // 공지사항 탭인 경우 목록 표시
            if (tabId === 'notice') {
                const noticeList = document.querySelector('.notice-list');
                const noticeView = document.querySelector('.notice-view');
                
                if (noticeList) noticeList.style.display = 'block';
                if (noticeView) noticeView.style.display = 'none';
            }
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
    const cancelBtn = document.querySelector('.inquiry-form .cancel-btn');
    const submitBtn = document.querySelector('.inquiry-form .submit-btn');
    
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
            // 폼 초기화하지 않고 문의내역 탭으로 이동
            document.querySelector('[data-tab="inquiry-list"]').click();
        });
    }

    // 취소 버튼 클릭 시
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 동작 방지
            Swal.fire({
                title: '작성을 취소하시겠습니까?',
                text: '작성 중인 내용은 저장되지 않습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '네, 취소하겠습니다',
                cancelButtonText: '아니오, 계속 작성하겠습니다'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 폼 초기화하지 않고 그대로 유지
                    return;
                }
            });
        });
    }

    // 문의하기 버튼 클릭 시
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 필수 입력 필드 검증
            const inquiryType = document.getElementById('inquiry-type').value;
            const inquiryTitle = document.getElementById('inquiry-title').value;
            const inquiryContent = document.getElementById('inquiry-content').value;
            const privacyCheck = document.querySelector('.inquiry-form input[type="checkbox"]').checked;

            if (!inquiryType) {
                Swal.fire({
                    icon: 'warning',
                    title: '문의 유형을 선택해주세요',
                    text: '문의하실 내용의 유형을 선택해주세요.'
                });
                return;
            }

            if (!inquiryTitle.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: '제목을 입력해주세요',
                    text: '문의 제목을 입력해주세요.'
                });
                return;
            }

            if (!inquiryContent.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: '내용을 입력해주세요',
                    text: '문의 내용을 입력해주세요.'
                });
                return;
            }

            if (!privacyCheck) {
                Swal.fire({
                    icon: 'warning',
                    title: '개인정보 수집 동의 필요',
                    text: '개인정보 수집 및 이용에 동의해주세요.'
                });
                return;
            }

            // 문의하기 성공 시
            Swal.fire({
                icon: 'success',
                title: '문의가 접수되었습니다',
                text: '빠른 시일 내에 답변 드리도록 하겠습니다.',
                confirmButtonText: '확인'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 문의내역 탭으로 이동
                    document.querySelector('[data-tab="inquiry-list"]').click();
                }
            });
        });
    }
}); 


// 페이지 로드 시 URL 해시 확인
document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash;
    if (hash) {
        // 모든 탭 컨텐츠 숨기기
        document.querySelectorAll('.cs-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 모든 메뉴 아이템 비활성화
        document.querySelectorAll('.cs-menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        // 해시에 해당하는 섹션 활성화
        const targetContent = document.querySelector(hash);
        if (targetContent) {
            targetContent.classList.add('active');
            
            // 해당 메뉴 아이템 활성화
            const targetTab = document.querySelector(`.cs-menu li[data-tab="${hash.substring(1)}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        }
    }
});

// 신고하기 관련 기능
document.addEventListener('DOMContentLoaded', function() {
    const reportList = document.getElementById('reportList');
    const reportForm = document.getElementById('reportForm');
    const reportView = document.getElementById('reportView');
    const writeReportBtn = document.getElementById('writeReportBtn');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const backToListBtn = document.getElementById('backToListBtn');
    const reportTitleLinks = document.querySelectorAll('.report-title-link');

    // 초기 상태 설정
    if (reportList) reportList.style.display = 'block';
    if (reportForm) reportForm.style.display = 'none';
    if (reportView) reportView.style.display = 'none';

    // 글쓰기 버튼 클릭
    writeReportBtn.addEventListener('click', function() {
        reportList.style.display = 'none';
        reportForm.style.display = 'block';
        reportView.style.display = 'none';
    });

    // 취소 버튼 클릭
    cancelReportBtn.addEventListener('click', function() {
        Swal.fire({
            title: '작성을 취소하시겠습니까?',
            text: '작성 중인 내용은 저장되지 않습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '네, 취소하겠습니다',
            cancelButtonText: '아니오, 계속 작성하겠습니다'
        }).then((result) => {
            if (result.isConfirmed) {
                reportForm.style.display = 'none';
                reportList.style.display = 'block';
                // 폼 초기화
                const form = document.getElementById('reportForm');
                if (form) {
                    // 폼 내의 모든 입력 필드 초기화
                    const inputs = form.querySelectorAll('input, textarea, select');
                    inputs.forEach(input => {
                        if (input.type === 'file') {
                            input.value = '';
                        } else {
                            input.value = '';
                        }
                    });
                    // 파일 목록 초기화
                    const fileList = document.getElementById('fileList');
                    if (fileList) {
                        fileList.innerHTML = '';
                    }
                }
            }
        });
    });

    // 목록으로 버튼 클릭
    backToListBtn.addEventListener('click', function() {
        reportList.style.display = 'block';
        reportForm.style.display = 'none';
        reportView.style.display = 'none';
    });

    // 신고 제목 클릭
    reportTitleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            reportList.style.display = 'none';
            reportForm.style.display = 'none';
            reportView.style.display = 'block';
        });
    });

    // 파일 업로드 관련
    const fileInput = document.getElementById('reportEvidence');
    const fileList = document.getElementById('fileList');

    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        fileList.innerHTML = '';
        
        for (let file of files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <button type="button" class="remove-file">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        }
    });

    // 파일 삭제
    fileList.addEventListener('click', function(e) {
        if (e.target.closest('.remove-file')) {
            e.target.closest('.file-item').remove();
        }
    });

    // 신고 폼 제출
    const reportFormElement = document.querySelector('.report-form');
    reportFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 여기에 신고 제출 로직 추가
        Swal.fire({
            title: '신고가 접수되었습니다',
            text: '검토 후 조치하도록 하겠습니다.',
            icon: 'success',
            confirmButtonText: '확인'
        }).then((result) => {
            if (result.isConfirmed) {
                reportList.style.display = 'block';
                reportForm.style.display = 'none';
                reportView.style.display = 'none';
                reportFormElement.reset();
                fileList.innerHTML = '';
            }
        });
    });
});

// report-view.js

// 신고글 삭제 함수
function deleteReport() {
    if (confirm('정말로 이 신고글을 삭제하시겠습니까?')) {
        // TODO: API 연동
        alert('신고글이 삭제되었습니다.');
        location.href = 'report_home.html';
    }
  }
  
  // 페이지 로드 시 신고글 데이터 가져오기
  document.addEventListener('DOMContentLoaded', function() {
    // 모든 DOM 요소 접근 전에 null 체크
    const elements = {
      submitComment: document.querySelector('.submit-comment'),
      commentWrite: document.querySelector('.comment-write textarea'),
      commentsList: document.querySelector('.comment-list'),
      commentCount: document.querySelector('.comment-count')
    };
  
    // 필요한 요소들이 모두 존재하는지 확인
    if (elements.submitComment && elements.commentWrite) {
      initializeComments(elements);
    }
    
    loadReportData();
  
    // 신고 제목 클릭 이벤트 처리
    const reportTitleLinks = document.querySelectorAll('.report-title-link');
    const reportList = document.getElementById('reportList');
    const reportView = document.getElementById('reportView');
    const backToListBtn = document.getElementById('backToListBtn');
  
    reportTitleLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const reportId = this.getAttribute('data-report-id');
        
        // 신고 목록 숨기기
        reportList.style.display = 'none';
        
        // 상세보기 탭 표시
        reportView.style.display = 'block';
        
        // 여기에 실제 데이터를 가져오는 API 호출이 들어갈 수 있습니다
        // 현재는 예시 데이터를 사용합니다
        updateReportView(reportId);
      });
    });
  
    // 목록으로 돌아가기 버튼 클릭 이벤트
    backToListBtn.addEventListener('click', function() {
      reportView.style.display = 'none';
      reportList.style.display = 'block';
    });
  
    // 신고하기 버튼 클릭 이벤트
    const writeReportBtn = document.getElementById('writeReportBtn');
    const reportForm = document.getElementById('reportForm');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const reportSubmitBtn = document.querySelector('.report-form .submit-btn');
  
    // 글쓰기 버튼 클릭 시
    writeReportBtn.addEventListener('click', function() {
      reportList.style.display = 'none';
      reportForm.style.display = 'block';
    });
  
    // 신고하기 폼 제출 시
    if (reportSubmitBtn) {
        reportSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 필수 입력 필드 검증
            const reportType = document.getElementById('reportType').value;
            const reportTitle = document.getElementById('reportTitle').value;
            const reportContent = document.getElementById('reportContent').value;

            if (reportType === 'select-title' || !reportTitle || !reportContent) {
                Swal.fire({
                    title: '입력 오류',
                    text: '모든 필수 항목을 입력해주세요.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }

            Swal.fire({
                title: '신고를 등록하시겠습니까?',
                text: '등록된 신고는 수정이 불가능합니다.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '네, 등록하겠습니다',
                cancelButtonText: '아니오, 취소하겠습니다'
            }).then((result) => {
                if (result.isConfirmed) {
                    // TODO: 실제 API 호출로 대체
                    Swal.fire({
                        title: '신고가 등록되었습니다',
                        text: '빠른 시일 내에 검토하도록 하겠습니다.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6'
                    }).then(() => {
                        reportForm.style.display = 'none';
                        reportList.style.display = 'block';
                        // 폼 초기화
                        const form = document.getElementById('reportForm');
                        if (form) {
                            // 폼 내의 모든 입력 필드 초기화
                            const inputs = form.querySelectorAll('input, textarea, select');
                            inputs.forEach(input => {
                                if (input.type === 'file') {
                                    input.value = '';
                                } else {
                                    input.value = '';
                                }
                            });
                            // 파일 목록 초기화
                            const fileList = document.getElementById('fileList');
                            if (fileList) {
                                fileList.innerHTML = '';
                            }
                        }
                    });
                }
            });
        });
    }
  });
  
  function initializeComments(elements) {
    // 댓글 등록 버튼 이벤트
    if (elements.submitComment) {
        elements.submitComment.addEventListener('click', function() {
            if (!elements.commentWrite) return;
            
            const content = elements.commentWrite.value.trim();
            if (!content) {
                Swal.fire({
                    title: '입력 오류',
                    text: '댓글 내용을 입력해주세요.',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }

            addComment({
                author: '현재 사용자',
                profile: './images/profile/pro_02.png',
                content: content,
                date: new Date().toLocaleDateString()
            });

            elements.commentWrite.value = '';
            updateCommentCount();
        });
    }
  
    // 답글/삭제 버튼 이벤트 위임
    if (elements.commentsList) {
        elements.commentsList.addEventListener('click', function(e) {
            // 답글 버튼
            if (e.target.classList.contains('reply-btn')) {
                const comment = e.target.closest('.comment');
                const replyForm = comment.querySelector('.reply-form');
                if (replyForm) {
                    // 다른 모든 답글 폼 닫기
                    document.querySelectorAll('.reply-form').forEach(form => {
                        if (form !== replyForm) {
                            form.style.display = 'none';
                        }
                    });
                    replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
                }
            }
            
            // 답글 취소 버튼
            if (e.target.classList.contains('cancel-reply')) {
                const replyForm = e.target.closest('.reply-form');
                if (replyForm) {
                    replyForm.style.display = 'none';
                }
            }
            
            // 답글 등록 버튼
            if (e.target.classList.contains('submit-reply')) {
                handleReplySubmit(e.target);
            }
            
            // 삭제 버튼
            if (e.target.classList.contains('reply-delete-btn')) {
                handleCommentDelete(e.target);
            }
        });
    }
  
    // 초기 댓글 수 업데이트
    updateCommentCount();
  }
  
  function handleReplySubmit(submitBtn) {
    const replyForm = submitBtn.closest('.reply-form');
    const textarea = replyForm.querySelector('textarea');
    const content = textarea.value.trim();
  
    if (!content) {
        Swal.fire({
            title: '입력 오류',
            text: '답글 내용을 입력해주세요.',
            icon: 'warning',
            confirmButtonColor: '#3085d6'
        });
        return;
    }
  
    const comment = submitBtn.closest('.comment');
    const replyList = comment.querySelector('.reply-list');
    
    addReply(replyList, {
        author: '현재 사용자',
        profile: './images/profile/pro_02.png',
        content: content,
        date: new Date().toLocaleDateString()
    });
  
    textarea.value = '';
    replyForm.style.display = 'none';
    updateCommentCount();

    // 답글 등록 성공 메시지
    Swal.fire({
        title: '답글 등록 완료',
        text: '답글이 등록되었습니다.',
        icon: 'success',
        confirmButtonColor: '#3085d6'
    });
  }
  
  function handleCommentDelete(deleteBtn) {
    Swal.fire({
        title: '댓글 삭제',
        text: '정말로 이 댓글을 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제하겠습니다',
        cancelButtonText: '아니오, 취소하겠습니다'
    }).then((result) => {
        if (result.isConfirmed) {
            const comment = deleteBtn.closest('.comment');
            comment.remove();
            updateCommentCount();
            Swal.fire({
                title: '삭제 완료',
                text: '댓글이 삭제되었습니다.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        }
    });
  }
  
  function addComment(data) {
    const commentList = document.querySelector('.comment-list');
    if (commentList) {
      const commentElement = createCommentElement(data);
      commentList.insertBefore(commentElement, commentList.firstChild);
    }
  }
  
  function addReply(replyList, data) {
    if (replyList) {
      const replyElement = createReplyElement(data);
      replyList.appendChild(replyElement);
    }
  }
  
  function createCommentElement(data) {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <div class="comment-info">
        <img src="${data.profile}" alt="프로필" class="comment-profile">
        <span class="comment-author">${data.author}</span>
        <span class="comment-date">${data.date}</span>
      </div>
      <p class="comment-text">${data.content}</p>
      <div class="comment-actions">
        <button class="reply-btn">답글</button>
        <button class="reply-delete-btn">삭제</button>
      </div>
      <div class="reply-form" style="display: none;">
        <textarea placeholder="답글을 입력하세요"></textarea>
        <div class="reply-buttons">
          <button class="submit-reply">등록</button>
          <button class="cancel-reply">취소</button>
        </div>
      </div>
      <div class="reply-list"></div>
    `;

    // 답글 버튼 이벤트 리스너 추가
    const replyBtn = div.querySelector('.reply-btn');
    const replyForm = div.querySelector('.reply-form');
    const submitReplyBtn = div.querySelector('.submit-reply');
    const cancelReplyBtn = div.querySelector('.cancel-reply');
    const replyList = div.querySelector('.reply-list');
    const deleteBtn = div.querySelector('.reply-delete-btn');

    if (replyBtn && replyForm) {
        replyBtn.addEventListener('click', function() {
            // 다른 모든 답글 폼 닫기
            document.querySelectorAll('.reply-form').forEach(form => {
                if (form !== replyForm) {
                    form.style.display = 'none';
                }
            });
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (cancelReplyBtn && replyForm) {
        cancelReplyBtn.addEventListener('click', function() {
            replyForm.style.display = 'none';
        });
    }

    if (submitReplyBtn && replyForm && replyList) {
        submitReplyBtn.addEventListener('click', function() {
            const textarea = replyForm.querySelector('textarea');
            const content = textarea.value.trim();

            if (!content) {
                Swal.fire({
                    title: '입력 오류',
                    text: '답글 내용을 입력해주세요.',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }

            addReply(replyList, {
                author: '현재 사용자',
                profile: './images/profile/pro_02.png',
                content: content,
                date: new Date().toLocaleDateString()
            });

            textarea.value = '';
            replyForm.style.display = 'none';
            updateCommentCount();

            Swal.fire({
                title: '답글 등록 완료',
                text: '답글이 등록되었습니다.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            handleCommentDelete(this);
        });
    }

    return div;
  }
  
  function createReplyElement(data) {
    const div = document.createElement('div');
    div.className = 'comment reply';
    div.innerHTML = `
      <div class="comment-info">
        <img src="${data.profile}" alt="프로필" class="comment-profile">
        <span class="comment-author">${data.author}</span>
        <span class="comment-date">${data.date}</span>
      </div>
      <p class="comment-text">${data.content}</p>
      <div class="comment-actions">
        <button class="reply-delete-btn">삭제</button>
      </div>
    `;
    return div;
  }
  
  function updateCommentCount() {
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
      const comments = document.querySelectorAll('.comment').length;
      commentCount.textContent = comments;
    }
  }
  
  function loadReportData() {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');
  
    if (reportId) {
      // TODO: API 연동하여 신고글 데이터 가져오기
      // 현재는 임시 데이터 사용
      const mockReport = {
        id: reportId,
        title: '신고글 제목이 들어갑니다',
        type: '욕설/비방',
        author: '홍길동',
        date: '2024-03-19 14:30',
        content: '신고글 내용이 들어갑니다. 자세한 설명과 함께 신고 사유를 작성해주세요.',
        status: '처리중',
        files: [
          { name: 'evidence1.jpg', type: 'image' },
          { name: 'evidence2.pdf', type: 'pdf' }
        ]
      };
  
      displayReport(mockReport);
    }
  }
  
  function displayReport(report) {
    const title = document.querySelector('.report-title h3');
    if (title) title.textContent = report.title;
    
    const status = document.querySelector('.report-status');
    if (status) {
      status.textContent = report.status;
      status.className = `report-status status-${report.status === '처리중' ? 'pending' : 
        report.status === '처리완료' ? 'completed' : 'rejected'}`;
    }
    
    const type = document.querySelector('.report-type');
    if (type) type.textContent = report.type;
    
    const author = document.querySelector('.report-author');
    if (author) author.textContent = `작성자: ${report.author}`;
    
    const date = document.querySelector('.report-date');
    if (date) date.textContent = `작성일: ${report.date}`;
    
    const content = document.querySelector('.report-content p');
    if (content) content.textContent = report.content;
  }
  
  // 임시 댓글 데이터
  let mockComments = [
    {
      id: 1,
      author: '관리자',
      content: '신고해 주셔서 감사합니다. 검토 후 조치하도록 하겠습니다.',
      date: '2024-03-19 15:00',
      isAdmin: true
    },
    {
      id: 2,
      author: '홍길동',
      content: '빠른 조치 부탁드립니다.',
      date: '2024-03-19 15:30',
      isAdmin: false
    }
  ];
  
  // 댓글 수정 함수
  function editComment(commentId) {
    const comment = mockComments.find(c => c.id === commentId);
    if (!comment) return;
  
    Swal.fire({
        title: '댓글 수정',
        input: 'textarea',
        inputValue: comment.content,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '수정',
        cancelButtonText: '취소',
        inputValidator: (value) => {
            if (!value) {
                return '댓글 내용을 입력해주세요!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            comment.content = result.value.trim();
            displayComments();
            Swal.fire({
                title: '수정 완료',
                text: '댓글이 수정되었습니다.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        }
    });
  }
  
  // 댓글 삭제 함수
  function deleteComment(commentId) {
    Swal.fire({
        title: '댓글 삭제',
        text: '정말로 이 댓글을 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제하겠습니다',
        cancelButtonText: '아니오, 취소하겠습니다'
    }).then((result) => {
        if (result.isConfirmed) {
            mockComments = mockComments.filter(c => c.id !== commentId);
            displayComments();
            Swal.fire({
                title: '삭제 완료',
                text: '댓글이 삭제되었습니다.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        }
    });
  }
  
  // 댓글 목록 표시 함수
  function displayComments() {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
  
    mockComments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-item';
      commentElement.innerHTML = `
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <div class="comment-content">${comment.content}</div>
        ${!comment.isAdmin ? `
          <div class="comment-actions">
            <button class="comment-edit-btn" onclick="editComment(${comment.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="comment-delete-btn" onclick="deleteComment(${comment.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        ` : ''}
      `;
      commentsList.appendChild(commentElement);
    });
  }
  
  // 상세보기 내용 업데이트 함수
  function updateReportView(reportId) {
    // 실제 구현에서는 API를 통해 데이터를 가져오는 API 호출이 들어갈 수 있습니다
    // 현재는 예시 데이터를 사용합니다
    const reportData = {
        title: '부적절한 댓글 신고합니다',
        type: '욕설/비방',
        date: '2024.03.18',
        status: '처리중',
        content: '해당 사용자가 작성한 댓글에 욕설과 비방이 포함되어 있습니다. 구체적인 내용은 첨부된 이미지를 참고해주세요.',
        response: '신고해주신 내용을 확인했습니다. 해당 댓글을 삭제하고 사용자에게 경고 조치를 취했습니다.',
        responseDate: '2024.03.19'
    };

    // DOM 요소들을 가져옵니다
    const titleElement = document.querySelector('.report-title h2');
    const metaElements = document.querySelectorAll('.report-meta span');
    const contentElement = document.querySelector('.report-content p');
    const responseElement = document.querySelector('.report-response p');
    const responseDateElement = document.querySelector('.response-date');
    const statusBadge = document.querySelector('.report-title .status-badge');

    // 각 요소가 존재하는지 확인하고 내용을 업데이트합니다
    if (titleElement) titleElement.textContent = reportData.title;
    
    if (metaElements.length >= 2) {
        metaElements[0].textContent = `신고 유형: ${reportData.type}`;
        metaElements[1].textContent = `등록일: ${reportData.date}`;
    }
    
    if (contentElement) contentElement.textContent = reportData.content;
    
    if (responseElement) responseElement.textContent = reportData.response;
    
    if (responseDateElement) responseDateElement.textContent = reportData.responseDate;
    
    if (statusBadge) {
        statusBadge.className = `status-badge status-${reportData.status === '처리중' ? 'pending' : 'completed'}`;
        statusBadge.textContent = reportData.status;
    }
  }
  
  // 공지사항 상세보기 기능
  document.addEventListener('DOMContentLoaded', function() {
    const noticeLinks = document.querySelectorAll('.notice-title-link');
    const noticeList = document.querySelector('.notice-list');
    const noticeView = document.querySelector('.notice-view');

    noticeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const noticeId = this.getAttribute('data-notice-id');
            showNoticeDetail(noticeId);
        });
    });

    // 목록으로 돌아가기 버튼
    const listBtn = document.querySelector('.list-btn');
    if (listBtn) {
        listBtn.addEventListener('click', function() {
            showNoticeList();
        });
    }

    function showNoticeDetail(noticeId) {
        // 실제 구현에서는 서버에서 해당 ID의 공지사항 데이터를 가져와야 합니다
        // 현재는 예시 데이터를 사용합니다
        if (noticeList && noticeView) {
            noticeList.style.display = 'none';
            noticeView.style.display = 'block';

            // 스크롤을 상단으로 이동
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    function showNoticeList() {
        if (noticeList && noticeView) {
            noticeView.style.display = 'none';
            noticeList.style.display = 'block';

            // 스크롤을 상단으로 이동
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // 공지사항 상세보기에서 목록으로 돌아가기
    const noticeBackToListBtn = document.getElementById('noticeBackToListBtn');
    if (noticeBackToListBtn) {
        noticeBackToListBtn.addEventListener('click', () => {
            const noticeView = document.getElementById('noticeView');
            const noticeList = document.querySelector('.notice-list');
            
            if (noticeView && noticeList) {
                noticeView.style.display = 'none';
                noticeList.style.display = 'block';
            }
        });
    }
  });
  
  // 1:1 문의하기 기능
  document.addEventListener('DOMContentLoaded', function() {
    const inquiryForm = document.querySelector('.inquiry-form');
    const cancelBtn = document.querySelector('.inquiry-form .cancel-btn');
    const submitBtn = document.querySelector('.inquiry-form .submit-btn');

    // 취소 버튼 클릭 시
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            Swal.fire({
                title: '작성을 취소하시겠습니까?',
                text: '작성 중인 내용은 저장되지 않습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '네, 취소하겠습니다',
                cancelButtonText: '아니오, 계속 작성하겠습니다'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 폼 초기화하지 않고 그대로 유지
                    return;
                }
            });
        });
    }

    // 문의하기 버튼 클릭 시
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 필수 입력 필드 검증
            const inquiryType = document.getElementById('inquiry-type').value;
            const inquiryTitle = document.getElementById('inquiry-title').value;
            const inquiryContent = document.getElementById('inquiry-content').value;
            const privacyCheck = document.querySelector('.inquiry-form input[type="checkbox"]').checked;

            if (!inquiryType) {
                Swal.fire({
                    icon: 'warning',
                    title: '문의 유형을 선택해주세요',
                    text: '문의하실 내용의 유형을 선택해주세요.'
                });
                return;
            }

            if (!inquiryTitle.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: '제목을 입력해주세요',
                    text: '문의 제목을 입력해주세요.'
                });
                return;
            }

            if (!inquiryContent.trim()) {
                Swal.fire({
                    icon: 'warning',
                    title: '내용을 입력해주세요',
                    text: '문의 내용을 입력해주세요.'
                });
                return;
            }

            if (!privacyCheck) {
                Swal.fire({
                    icon: 'warning',
                    title: '개인정보 수집 동의 필요',
                    text: '개인정보 수집 및 이용에 동의해주세요.'
                });
                return;
            }

            // 문의하기 성공 시
            Swal.fire({
                icon: 'success',
                title: '문의가 접수되었습니다',
                text: '빠른 시일 내에 답변 드리도록 하겠습니다.',
                confirmButtonText: '확인'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 문의내역 탭으로 이동
                    document.querySelector('[data-tab="inquiry-list"]').click();
                }
            });
        });
    }
  });
  
  // 문의내역 관련 기능
  document.addEventListener('DOMContentLoaded', function() {
    const inquiryList = document.getElementById('inquiryList');
    const inquiryView = document.getElementById('inquiryView');
    const inquiryBackToListBtn = document.getElementById('inquiryBackToListBtn');
    const inquiryTitleLinks = document.querySelectorAll('.inquiry-title-link');
    const submitCommentBtn = document.querySelector('.inquiry-view .submit-comment');
    const commentTextarea = document.querySelector('.inquiry-view .comment-write textarea');
    const commentList = document.querySelector('.inquiry-view .comment-list');
    const commentCount = document.querySelector('.inquiry-view .comment-count');

    // 문의 제목 클릭 시 상세보기
    inquiryTitleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const inquiryId = this.getAttribute('data-inquiry-id');
            showInquiryDetail(inquiryId);
        });
    });

    // 목록으로 버튼 클릭
    if (inquiryBackToListBtn) {
        inquiryBackToListBtn.addEventListener('click', function() {
            if (inquiryView && inquiryList) {
                inquiryView.style.display = 'none';
                inquiryList.style.display = 'block';
            }
        });
    }

    // 댓글 작성 버튼 클릭
    if (submitCommentBtn && commentTextarea) {
        submitCommentBtn.addEventListener('click', function() {
            const content = commentTextarea.value.trim();
            if (!content) {
                Swal.fire({
                    icon: 'warning',
                    title: '답변을 입력해주세요',
                    text: '답변 내용을 입력해주세요.'
                });
                return;
            }

            // 답변 추가
            const commentData = {
                author: '관리자',
                profile: '../images/profile/pro_01.png',
                content: content,
                date: new Date().toLocaleDateString()
            };

            addInquiryComment(commentData);

            // 입력창 초기화
            commentTextarea.value = '';
            
            // 댓글 수 업데이트
            updateInquiryCommentCount();

            // 답변 등록 성공 메시지
            Swal.fire({
                icon: 'success',
                title: '답변이 등록되었습니다',
                showConfirmButton: false,
                timer: 1500
            });
        });
    }

    // 문의내역 상세보기 표시
    function showInquiryDetail(inquiryId) {
        if (inquiryList) inquiryList.style.display = 'none';
        if (inquiryView) inquiryView.style.display = 'block';
        
        // 댓글 기능 초기화
        initializeInquiryComments();
    }

    // 문의내역 댓글 기능 초기화
    function initializeInquiryComments() {
        const commentList = document.querySelector('.inquiry-comments .comment-list');
        if (!commentList) return;

        // 답글 버튼 이벤트
        const replyBtns = commentList.querySelectorAll('.reply-btn');
        replyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const comment = this.closest('.comment');
                const replyForm = comment.querySelector('.reply-form');
                
                // 다른 모든 답글 폼 닫기
                document.querySelectorAll('.reply-form').forEach(form => {
                    if (form !== replyForm) form.style.display = 'none';
                });
                
                // 현재 답글 폼 토글
                replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
            });
        });

        // 답글 취소 버튼 이벤트
        const cancelReplyBtns = commentList.querySelectorAll('.cancel-reply');
        cancelReplyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const replyForm = this.closest('.reply-form');
                replyForm.style.display = 'none';
            });
        });

        // 답글 등록 버튼 이벤트
        const submitReplyBtns = commentList.querySelectorAll('.submit-reply');
        submitReplyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const replyForm = this.closest('.reply-form');
                const textarea = replyForm.querySelector('textarea');
                const replyText = textarea.value.trim();
                
                if (!replyText) {
                    Swal.fire({
                        icon: 'warning',
                        title: '답글을 입력해주세요',
                        text: '답글 내용을 입력해주세요.'
                    });
                    return;
                }

                // 답글 데이터 생성
                const replyData = {
                    author: '홍길동',
                    profile: '../images/profile/pro_03.png',
                    content: replyText,
                    date: new Date().toLocaleDateString()
                };

                // 답글 추가
                const replyList = replyForm.closest('.comment').querySelector('.reply-list');
                addInquiryReply(replyList, replyData);

                // 답글 폼 초기화 및 숨기기
                textarea.value = '';
                replyForm.style.display = 'none';

                // 댓글 수 업데이트
                updateInquiryCommentCount();

                // 성공 메시지
                Swal.fire({
                    icon: 'success',
                    title: '답글이 등록되었습니다',
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        });

        // 댓글 삭제 버튼 이벤트
        const deleteBtns = commentList.querySelectorAll('.reply-delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const comment = this.closest('.comment');
                
                Swal.fire({
                    title: '댓글을 삭제하시겠습니까?',
                    text: '삭제된 댓글은 복구할 수 없습니다.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '네, 삭제하겠습니다',
                    cancelButtonText: '아니오, 취소하겠습니다'
                }).then((result) => {
                    if (result.isConfirmed) {
                        comment.remove();
                        updateInquiryCommentCount();
                        
                        Swal.fire({
                            icon: 'success',
                            title: '댓글이 삭제되었습니다',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            });
        });
    }

    // 문의내역 답변 추가 함수
    function addInquiryComment(data) {
        const commentList = document.querySelector('.inquiry-comments .comment-list');
        if (!commentList) return;

        const commentElement = document.createElement('div');
        commentElement.className = 'comment admin';
        commentElement.innerHTML = `
            <div class="comment-info">
                <img src="${data.profile}" alt="프로필" class="comment-profile">
                <span class="comment-author">${data.author}</span>
                <span class="comment-date">${data.date}</span>
            </div>
            <p class="comment-text">${data.content}</p>
            <div class="comment-actions">
                <button class="reply-btn">답글</button>
                <button class="reply-delete-btn">삭제</button>
            </div>
            <div class="reply-form" style="display: none;">
                <textarea placeholder="답글을 입력하세요"></textarea>
                <div class="reply-buttons">
                    <button class="submit-reply">등록</button>
                    <button class="cancel-reply">취소</button>
                </div>
            </div>
            <div class="reply-list"></div>
        `;

        commentList.appendChild(commentElement);
        initializeInquiryComments();
    }

    // 문의내역 답글 추가 함수
    function addInquiryReply(replyList, data) {
        if (!replyList) return;

        const replyElement = document.createElement('div');
        replyElement.className = 'comment reply';
        replyElement.innerHTML = `
            <div class="comment-info">
                <img src="${data.profile}" alt="프로필" class="comment-profile">
                <span class="comment-author">${data.author}</span>
                <span class="comment-date">${data.date}</span>
            </div>
            <p class="comment-text">${data.content}</p>
            <div class="comment-actions">
                <button class="reply-delete-btn">삭제</button>
            </div>
        `;

        replyList.appendChild(replyElement);
    }

    // 문의내역 댓글 수 업데이트 함수
    function updateInquiryCommentCount() {
        const commentCount = document.querySelector('.inquiry-view .comment-count');
        if (commentCount) {
            const comments = document.querySelectorAll('.inquiry-view .comment').length;
            commentCount.textContent = comments;
        }
    }
  });
  
  
  