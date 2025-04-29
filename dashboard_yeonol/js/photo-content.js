// photo-content.js
document.addEventListener('DOMContentLoaded', function() {
    // jQuery가 로드될 때까지 대기
    const checkJQuery = setInterval(function() {
        if (window.jQuery) {
            clearInterval(checkJQuery);
            initializePhotoContent();
        }
    }, 100);
});

function initializePhotoContent() {
    window.PhotoContent = {
        init: function() {
            this.bindEvents();
            this.setupPhotoScroll();
            this.initializeFilters();
            this.initializeCheckboxes();
            this.initializeActions();
        },

        bindEvents: function() {
            const self = this;
            $(document).on('click', '.photo-preview', function(e) {
                e.preventDefault();
                const photoCard = $(this).closest('.photo-card');
                self.openPhotoModal(photoCard);
            });

            // 사진 스크롤 버튼 이벤트
            $(document).on('click', '.photo-scroll-btn', function(e) {
                e.preventDefault();
                const direction = $(this).hasClass('prev') ? -1 : 1;
                const scrollWrap = $(this).closest('.photo-preview-wrap').find('.photo-preview-scroll');
                self.scrollPhotos(scrollWrap, direction);
            });
        },

        setupPhotoScroll: function() {
            // 스크롤 버튼 추가
            $('.photo-preview-wrap').each(function() {
                const hasMultiplePhotos = $(this).find('.photo-preview').length > 1;
                if (hasMultiplePhotos) {
                    $(this).append(`
                        <button class="photo-scroll-btn prev" aria-label="이전 사진">
                            <i class="icon-chevron-left"></i>
                        </button>
                        <button class="photo-scroll-btn next" aria-label="다음 사진">
                            <i class="icon-chevron-right"></i>
                        </button>
                    `);
                }
            });
        },

        scrollPhotos: function(scrollWrap, direction) {
            const scrollAmount = scrollWrap.width();
            const currentScroll = scrollWrap.scrollLeft();
            scrollWrap.animate({
                scrollLeft: currentScroll + (scrollAmount * direction)
            }, 300);
        },

        openPhotoModal: function(photoCard) {
            const photoSources = photoCard.find('.photo-preview').map(function() {
                return $(this).attr('src');
            }).get();

            const modalContent = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">사진 상세</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="닫기">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="photo-gallery">
                            <div class="photo-gallery-main">
                                <img src="${photoSources[0]}" alt="메인 이미지" class="main-photo">
                                ${photoSources.length > 1 ? `
                                    <button class="gallery-nav prev">
                                        <i class="icon-chevron-left"></i>
                                    </button>
                                    <button class="gallery-nav next">
                                        <i class="icon-chevron-right"></i>
                                    </button>
                                ` : ''}
                            </div>
                            ${photoSources.length > 1 ? `
                                <div class="photo-gallery-thumbs">
                                    ${photoSources.map((src, index) => `
                                        <img src="${src}" alt="썸네일 ${index + 1}" 
                                             class="thumb-photo ${index === 0 ? 'active' : ''}"
                                             data-index="${index}">
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="photo-info">
                            <h6 class="photo-title">${photoCard.find('.photo-title-link').text()}</h6>
                            <div class="photo-meta">${photoCard.find('.photo-meta').html()}</div>
                            <div class="photo-stats">${photoCard.find('.photo-stats').html()}</div>
                        </div>
                    </div>
                </div>
            `;

            $('#photoModal .modal-dialog').html(modalContent);
            $('#photoModal').modal('show');

            // 갤러리 네비게이션 이벤트 바인딩
            if (photoSources.length > 1) {
                this.bindGalleryEvents();
            }
        },

        bindGalleryEvents: function() {
            let currentIndex = 0;
            const totalPhotos = $('.thumb-photo').length;

            // 썸네일 클릭
            $(document).on('click', '.thumb-photo', function() {
                currentIndex = $(this).data('index');
                updateGallery();
            });

            // 네비게이션 버튼 클릭
            $(document).on('click', '.gallery-nav', function() {
                if ($(this).hasClass('prev')) {
                    currentIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
                } else {
                    currentIndex = (currentIndex + 1) % totalPhotos;
                }
                updateGallery();
            });

            function updateGallery() {
                const newSrc = $('.thumb-photo').eq(currentIndex).attr('src');
                $('.main-photo').attr('src', newSrc);
                $('.thumb-photo').removeClass('active');
                $('.thumb-photo').eq(currentIndex).addClass('active');
            }
        },

        // 필터 관련 메서드 추가
        initializeFilters: function() {
            const self = this;
            $('#statusFilter, #reportFilter, #sortFilter').on('change', function() {
                self.applyFilters();
            });
        },

        applyFilters: function() {
            const self = this;
            const statusFilter = $('#statusFilter').val();
            const reportFilter = $('#reportFilter').val();
            const sortFilter = $('#sortFilter').val();

            console.log('Applying filters:', { statusFilter, reportFilter, sortFilter });

            $('.photo-card').each(function() {
                let show = true;
                const $card = $(this);

                // 상태 필터 적용
                if (statusFilter) {
                    const $statusBadge = $card.find('.content-status-badge');
                    const currentStatus = $statusBadge.hasClass('status-' + statusFilter);
                    if (!currentStatus) {
                        show = false;
                    }
                }

                // 신고 필터 적용
                if (reportFilter && show) {
                    const reportCount = parseInt($card.find('.report-count').text().match(/\d+/)?.[0] || '0');
                    if (reportFilter === 'reported' && reportCount === 0) {
                        show = false;
                    }
                    if (reportFilter === 'not-reported' && reportCount > 0) {
                        show = false;
                    }
                }

                // 필터 결과 적용
                $card.toggle(show);
            });

            // 정렬 적용
            this.sortPhotos(sortFilter);
            
            // 필터 적용 후 선택 상태 업데이트
            this.updateSelectAllState();
            this.updateSelectedCount(); // 선택된 개수 업데이트
            this.updateBulkActionButtons();
        },

        sortPhotos: function(sortBy) {
            const container = $('.photo-card-container');
            const photos = container.children('.photo-card:visible').get();

            photos.sort((a, b) => {
                const $a = $(a);
                const $b = $(b);
                
                switch(sortBy) {
                    case 'latest':
                    case 'oldest':
                        const dateA = new Date($a.find('.photo-date').text().trim());
                        const dateB = new Date($b.find('.photo-date').text().trim());
                        return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
                    
                    case 'views':
                        const viewsA = parseInt($a.find('.icon-eye').parent().text().match(/\d+/)?.[0] || '0');
                        const viewsB = parseInt($b.find('.icon-eye').parent().text().match(/\d+/)?.[0] || '0');
                        return viewsB - viewsA;
                    
                    case 'likes':
                        const likesA = parseInt($a.find('.icon-heart').parent().text().match(/\d+/)?.[0] || '0');
                        const likesB = parseInt($b.find('.icon-heart').parent().text().match(/\d+/)?.[0] || '0');
                        return likesB - likesA;
                    
                    case 'reports':
                        const reportsA = parseInt($a.find('.report-count').text().match(/\d+/)?.[0] || '0');
                        const reportsB = parseInt($b.find('.report-count').text().match(/\d+/)?.[0] || '0');
                        return reportsB - reportsA;
                    
                    default:
                        return 0;
                }
            });

            container.append(photos);
        },

        // 체크박스 관련 메서드 추가
        initializeCheckboxes: function() {
            const self = this;
            
            // 전체 선택 체크박스 이벤트
            $('#selectAllCheckbox').on('change', function() {
                const isChecked = $(this).prop('checked');
                $('.photo-card:visible .photo-checkbox').prop('checked', isChecked);
                self.updateSelectedCount(); // 선택된 개수 업데이트
                self.updateBulkActionButtons();
            });

            // 개별 체크박스 이벤트
            $(document).on('change', '.photo-checkbox', function() {
                self.updateSelectAllState();
                self.updateSelectedCount(); // 선택된 개수 업데이트
                self.updateBulkActionButtons();
            });
        },

        updateSelectAllState: function() {
            const visibleCheckboxes = $('.photo-card:visible .photo-checkbox');
            const checkedCheckboxes = visibleCheckboxes.filter(':checked');
            
            const selectAllCheckbox = $('#selectAllCheckbox');
            
            if (visibleCheckboxes.length === 0) {
                selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
            } else if (checkedCheckboxes.length === 0) {
                selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
            } else if (checkedCheckboxes.length === visibleCheckboxes.length) {
                selectAllCheckbox.prop('checked', true).prop('indeterminate', false);
            } else {
                selectAllCheckbox.prop('checked', false).prop('indeterminate', true);
            }

            this.updateSelectedCount(); // 선택된 개수 업데이트
        },

        updateSelectedCount: function() {
            // 선택된 체크박스 개수 계산
            const checkedCount = $('.photo-card:visible .photo-checkbox:checked').length;
            // 선택된 개수 표시 업데이트
            $('.selected-count .count').text(checkedCount);
        },

        updateBulkActionButtons: function() {
            const hasChecked = $('.photo-card:visible .photo-checkbox:checked').length > 0;
            $('#bulkWarning, #bulkBlock, #bulkDelete').prop('disabled', !hasChecked);
        },

        initializeActions: function() {
            const self = this;

            // 개별 액션 버튼 이벤트
            $(document).on('click', '.photo-actions .btn-warning', function() {
                const photoCard = $(this).closest('.photo-card');
                self.handleWarning([photoCard]);
            });

            $(document).on('click', '.photo-actions .btn-block', function() {
                const photoCard = $(this).closest('.photo-card');
                self.handleBlock([photoCard]);
            });

            $(document).on('click', '.photo-actions .btn-delete', function() {
                const photoCard = $(this).closest('.photo-card');
                self.handleDelete([photoCard]);
            });

            // 벌크 액션 버튼 이벤트
            $('#bulkWarning').on('click', function() {
                const selectedCards = $('.photo-card:visible .photo-checkbox:checked').closest('.photo-card');
                self.handleWarning(selectedCards);
            });

            $('#bulkBlock').on('click', function() {
                const selectedCards = $('.photo-card:visible .photo-checkbox:checked').closest('.photo-card');
                self.handleBlock(selectedCards);
            });

            $('#bulkDelete').on('click', function() {
                const selectedCards = $('.photo-card:visible .photo-checkbox:checked').closest('.photo-card');
                self.handleDelete(selectedCards);
            });
        },

        handleWarning: function(cards) {
            const self = this;
            const $modal = $('#warningModal');
            const $warningType = $('#warningType');
            const $warningDetail = $('#warningDetail');
            const $deleteContent = $('#deleteContent');
            const $restrictUser = $('#restrictUser');
            const $sendWarningBtn = $('#sendWarningBtn');

            // 모달 초기화
            $warningType.val('');
            $warningDetail.val('');
            $deleteContent.prop('checked', false);
            $restrictUser.prop('checked', false);

            // 경고 발송 버튼 클릭 이벤트
            $sendWarningBtn.off('click').on('click', function() {
                const warningType = $warningType.val();
                const warningDetail = $warningDetail.val();
                const shouldDelete = $deleteContent.is(':checked');
                const shouldRestrict = $restrictUser.is(':checked');

                if (!warningType) {
                    alert('경고 유형을 선택해주세요.');
                    return;
                }

                // 상태 업데이트
                cards.each(function() {
                    const $card = $(this);
                    $card.find('.content-status-badge')
                        .removeClass('status-active status-blocked status-deleted')
                        .addClass('status-warning')
                        .text('경고');
                });

                // 모달 닫기
                $modal.modal('hide');

                // 성공 메시지
                Swal.fire({
                    title: '완료',
                    text: '경고가 발송되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                });

                // 체크박스 상태 업데이트
                self.updateSelectAllState();
            });

            // 모달 표시
            $modal.modal('show');
        },

        handleBlock: function(cards) {
            const self = this;
            Swal.fire({
                title: '차단하시겠습니까?',
                text: '선택한 게시물을 차단하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '차단',
                cancelButtonText: '취소',
                confirmButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    cards.each(function() {
                        $(this).find('.content-status-badge')
                            .removeClass('status-active status-warning status-deleted')
                            .addClass('status-blocked')
                            .text('차단');
                    });
                    self.updateSelectAllState();
                    Swal.fire('완료', '선택한 게시물이 차단되었습니다.', 'success');
                }
            });
        },

        handleDelete: function(cards) {
            const self = this;
            Swal.fire({
                title: '삭제하시겠습니까?',
                text: '선택한 게시물을 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                confirmButtonColor: '#dc3545'
            }).then((result) => {
                if (result.isConfirmed) {
                    cards.each(function() {
                        $(this).find('.content-status-badge')
                            .removeClass('status-active status-warning status-blocked')
                            .addClass('status-deleted')
                            .text('삭제');
                    });
                    self.updateSelectAllState();
                    Swal.fire('완료', '선택한 게시물이 삭제되었습니다.', 'success');
                }
            });
        }
    };

    // PhotoContent 초기화
    window.PhotoContent.init();
} 