$(document).ready(function() {
	// DataTables 초기화
	const audioTable = $('#audioTable').DataTable({
			language: {
					url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/ko.json'
			},
			order: [[1, 'desc']], // 번호 기준 내림차순 정렬
			columnDefs: [
					{
							targets: [0, 3, 10], // 체크박스, 오디오 플레이어, 관리 버튼 열
							orderable: false,
							searchable: false
					}
			],
			dom: 'Bfrtip',
			buttons: [
					{
							text: '<i class="icon-alert-triangle"></i> 선택 경고',
							className: 'btn btn-warning bulk-action',
							action: function() {
									handleBulkWarning();
							}
					},
					{
							text: '<i class="icon-slash"></i> 선택 차단',
							className: 'btn btn-block bulk-action',
							action: function() {
									handleBulkBlock();
							}
					},
					{
							text: '<i class="icon-trash-2"></i> 선택 삭제',
							className: 'btn btn-delete bulk-action',
							action: function() {
									handleBulkDelete();
							}
					}
			],
			pageLength: 10,
			lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "전체"]]
	});

	// 전체 선택 체크박스 이벤트
	$('#selectAll').on('change', function() {
			const isChecked = $(this).prop('checked');
			$('.audio-checkbox').prop('checked', isChecked);
			updateBulkButtons();
	});

	// 개별 체크박스 이벤트
	$(document).on('change', '.audio-checkbox', function() {
			updateSelectAllCheckbox();
			updateBulkButtons();
	});

	function updateSelectAllCheckbox() {
			const totalCheckboxes = $('.audio-checkbox').length;
			const checkedCheckboxes = $('.audio-checkbox:checked').length;
			$('#selectAll').prop('checked', totalCheckboxes === checkedCheckboxes && totalCheckboxes > 0);
	}

	function updateBulkButtons() {
			const hasChecked = $('.audio-checkbox:checked').length > 0;
			$('.bulk-action').prop('disabled', !hasChecked);
	}

	// 초기 버튼 상태 설정
	updateBulkButtons();

	// 비디오 미리보기 자동 재생
	$('.video-preview').on('mouseover', function() {
			if (!this.playing) {
					this.play();
			}
	}).on('mouseout', function() {
			if (this.playing) {
					this.pause();
					this.currentTime = 0;
			}
	});
});

// 비디오 필터 관리
const VideoFilter = {
		init() {
				this.setupFilterEvents();
				this.setupDateRangeButtons();
		},

		setupFilterEvents() {
				// 필터 적용 버튼
				const applyBtn = document.querySelector('button[onclick="applyFilters()"]');
				if (applyBtn) {
						applyBtn.addEventListener('click', () => this.applyFilters());
				}

				// 필터 초기화 버튼
				const resetBtn = document.querySelector('button[onclick="resetFilters()"]');
				if (resetBtn) {
						resetBtn.addEventListener('click', () => this.resetFilters());
				}

				// 필터 변경 이벤트
				['statusFilter', 'reportFilter', 'sortFilter'].forEach(filterId => {
						const filter = document.getElementById(filterId);
						if (filter) {
								filter.addEventListener('change', () => this.updateFilterStatus());
						}
				});
		},

		setupDateRangeButtons() {
				const startDate = document.getElementById('startDate');
				const endDate = document.getElementById('endDate');
				
				if (startDate && endDate) {
						// 날짜 입력 시 유효성 검사
						startDate.addEventListener('change', () => this.validateDateRange());
						endDate.addEventListener('change', () => this.validateDateRange());
				}
		},

		applyFilters() {
				const filters = this.getFilterValues();
				
				if (!this.validateDateRange()) {
						return;
				}

				this.filterVideos(filters);
				this.updateFilterStatus();
		},

		getFilterValues() {
				return {
						status: document.getElementById('statusFilter')?.value || '',
						report: document.getElementById('reportFilter')?.value || '',
						sort: document.getElementById('sortFilter')?.value || 'latest',
						startDate: document.getElementById('startDate')?.value || '',
						endDate: document.getElementById('endDate')?.value || ''
				};
		},

		validateDateRange() {
				const startDate = document.getElementById('startDate')?.value;
				const endDate = document.getElementById('endDate')?.value;

				if (startDate && endDate) {
						if (new Date(startDate) > new Date(endDate)) {
								alert('시작일이 종료일보다 늦을 수 없습니다.');
								return false;
						}
				}
				return true;
		},

		filterVideos(filters) {
				const videos = document.querySelectorAll('.video-card');
				
				videos.forEach(card => {
						let show = true;

						// 상태 필터
						if (filters.status) {
								const status = card.querySelector('.content-status-badge').classList;
								show = show && status.contains(`status-${filters.status}`);
						}

						// 신고 필터
						if (filters.report) {
								const reportCount = parseInt(card.querySelector('.report-count')?.textContent || '0');
								if (filters.report === 'reported') {
										show = show && reportCount > 0;
								} else {
										show = show && reportCount === 0;
								}
						}

						// 날짜 필터
						if (filters.startDate || filters.endDate) {
								const videoDate = new Date(card.querySelector('.video-date')?.textContent);
								if (filters.startDate) {
										show = show && videoDate >= new Date(filters.startDate);
								}
								if (filters.endDate) {
										show = show && videoDate <= new Date(filters.endDate);
								}
						}

						// 카드 표시/숨김
						card.style.display = show ? '' : 'none';
				});

				// 정렬 적용
				this.sortVideos(filters.sort);
		},

		sortVideos(sortType) {
				const container = document.querySelector('.video-card-container');
				const cards = Array.from(container.children);

				cards.sort((a, b) => {
						switch (sortType) {
								case 'latest':
										return this.compareDate(b, a);
								case 'oldest':
										return this.compareDate(a, b);
								case 'views':
										return this.compareNumbers(b, a, '.icon-eye');
								case 'likes':
										return this.compareNumbers(b, a, '.icon-heart');
								case 'reports':
										return this.compareNumbers(b, a, '.report-count');
								default:
										return 0;
						}
				});

				// 정렬된 카드 다시 삽입
				cards.forEach(card => container.appendChild(card));
		},

		compareDate(cardA, cardB) {
				const dateA = new Date(cardA.querySelector('.video-date')?.textContent);
				const dateB = new Date(cardB.querySelector('.video-date')?.textContent);
				return dateA - dateB;
		},

		compareNumbers(cardA, cardB, selector) {
				const numA = parseInt(cardA.querySelector(selector)?.textContent || '0');
				const numB = parseInt(cardB.querySelector(selector)?.textContent || '0');
				return numA - numB;
		},

		resetFilters() {
				// 필터 초기화
				['statusFilter', 'reportFilter', 'sortFilter'].forEach(filterId => {
						const filter = document.getElementById(filterId);
						if (filter) filter.value = '';
				});

				// 날짜 초기화
				const startDate = document.getElementById('startDate');
				const endDate = document.getElementById('endDate');
				if (startDate) startDate.value = '';
				if (endDate) endDate.value = '';

				// 모든 비디오 표시
				document.querySelectorAll('.video-card').forEach(card => {
						card.style.display = '';
				});

				this.updateFilterStatus();
		},

		updateFilterStatus() {
				const activeFilters = [];
				const filters = this.getFilterValues();

				if (filters.status) {
						activeFilters.push(`상태: ${document.getElementById('statusFilter').options[document.getElementById('statusFilter').selectedIndex].text}`);
				}
				if (filters.report) {
						activeFilters.push(`신고: ${document.getElementById('reportFilter').options[document.getElementById('reportFilter').selectedIndex].text}`);
				}
				if (filters.startDate) activeFilters.push(`시작일: ${filters.startDate}`);
				if (filters.endDate) activeFilters.push(`종료일: ${filters.endDate}`);
				if (filters.sort !== 'latest') {
						activeFilters.push(`정렬: ${document.getElementById('sortFilter').options[document.getElementById('sortFilter').selectedIndex].text}`);
				}

				// 활성 필터 표시 업데이트
				this.updateActiveFiltersDisplay(activeFilters);
		},

		updateActiveFiltersDisplay(activeFilters) {
				let filterStatus = document.querySelector('.filter-status');
				
				if (activeFilters.length > 0) {
						if (!filterStatus) {
								filterStatus = document.createElement('div');
								filterStatus.className = 'filter-status';
								document.querySelector('.filter-section').after(filterStatus);
						}

						filterStatus.innerHTML = `
								<div class="active-filters">
										${activeFilters.map(filter => `<span class="filter-tag">${filter}</span>`).join('')}
								</div>
						`;
				} else if (filterStatus) {
						filterStatus.remove();
				}
		}
};

// 비디오 플레이어 관리
const VideoPlayer = {
		init: function() {
				this.bindEvents();
		},

		bindEvents: function() {
				// 비디오 컨트롤 버튼 클릭 이벤트
				$(document).on('click', '.video-control-btn', (e) => {
						e.stopPropagation();
						const video = $(e.currentTarget).closest('.video-preview-wrap').find('video')[0];
						this.togglePlay(video);
				});

				// 비디오 미리보기 hover 이벤트
				$('.video-preview-wrap').hover(
						function() {
								const video = $(this).find('video')[0];
								if (video) {
										video.muted = true;
										video.play();
								}
						},
						function() {
								const video = $(this).find('video')[0];
								if (video) {
										video.pause();
										video.currentTime = 0;
								}
						}
				);

				// 비디오 클릭 이벤트 (모달 열기)
				$(document).on('click', '.video-preview-wrap', function(e) {
						if (!$(e.target).closest('.video-control-btn').length) {
								const video = $(this).find('video')[0];
								VideoModal.open(video);
						}
				});
		},

		togglePlay: function(video) {
				if (video.paused) {
						// 다른 모든 비디오 정지
						$('video').each(function() {
								if (this !== video) {
										this.pause();
										this.currentTime = 0;
								}
						});
						video.play();
				} else {
						video.pause();
				}
		},

		stopAllVideos: function() {
				$('video').each(function() {
						this.pause();
						this.currentTime = 0;
				});
		}
};

// 비디오 모달 관리
const VideoModal = {
		init: function() {
				this.modal = $('#videoModal');
				this.lastFocusedElement = null;
				this.setupModalEvents();
		},

		setupModalEvents: function() {
				// 모달이 열리기 전
				this.modal.on('show.bs.modal', () => {
						// 현재 포커스된 요소 저장
						this.lastFocusedElement = document.activeElement;
						VideoPlayer.stopAllVideos();
				});

				// 모달이 완전히 열린 후
				this.modal.on('shown.bs.modal', () => {
						// 모달 내 첫 번째 포커스 가능한 요소에 포커스
						this.modal.find('.close').focus();
				});

				// 모달이 닫히기 전
				this.modal.on('hide.bs.modal', () => {
						const modalVideo = this.modal.find('video')[0];
						if (modalVideo) {
								modalVideo.pause();
								modalVideo.currentTime = 0;
						}
				});

				// 모달이 완전히 닫힌 후
				this.modal.on('hidden.bs.modal', () => {
						// 이전에 포커스되었던 요소로 포커스 반환
						if (this.lastFocusedElement) {
								this.lastFocusedElement.focus();
						}
				});

				// 모달 내 포커스 트랩 설정
				this.modal.on('keydown', (e) => {
						if (e.key === 'Tab') {
								const focusableElements = this.modal.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
								const firstFocusableElement = focusableElements[0];
								const lastFocusableElement = focusableElements[focusableElements.length - 1];

								// Shift + Tab 처리
								if (e.shiftKey) {
										if (document.activeElement === firstFocusableElement) {
												e.preventDefault();
												lastFocusableElement.focus();
										}
								} 
								// Tab 처리
								else {
										if (document.activeElement === lastFocusableElement) {
												e.preventDefault();
												firstFocusableElement.focus();
										}
								}
						}
						// ESC 키 처리
						else if (e.key === 'Escape') {
								this.modal.modal('hide');
						}
				});
		},

		open: function(videoElement) {
				const videoCard = $(videoElement).closest('.video-card');
				const videoSrc = $(videoElement).find('source').attr('src');
				const title = videoCard.find('.video-title-link').text();
				const titleLink = videoCard.find('.video-title-link').attr('href');
				const author = videoCard.find('.video-author span').text();
				const date = videoCard.find('.video-date').text();
				
				// 상태 정보 가져오기
				const statusBadge = videoCard.find('.content-status-badge').clone();
				const viewCount = videoCard.find('.video-stats .icon-eye').parent().text().trim();
				const likeCount = videoCard.find('.video-stats .icon-heart').parent().text().trim();
				const commentCount = videoCard.find('.video-stats .icon-message-circle').parent().text().trim();
				const reportCount = videoCard.find('.video-stats .report-count').text().trim();
				
				// 비디오 소스가 없는 경우 에러 처리
				if (!videoSrc) {
						CommonAlerts.showError('비디오 소스를 찾을 수 없습니다.');
						return;
				}
				
				// 모달 내용 업데이트
				const modalVideo = this.modal.find('video');
				modalVideo.find('source').attr('src', videoSrc);
				modalVideo[0].load(); // 새 소스 로드
				modalVideo[0].pause(); // 비디오 일시 정지
				
				// 비디오 정보 업데이트
				const videoTitleElement = this.modal.find('#videoTitle');
				videoTitleElement.text(title);
				videoTitleElement.attr('href', titleLink);
				this.modal.find('#videoAuthor').text(author);
				this.modal.find('#videoDate').text(date);
				
				// 상태 정보 업데이트
				const videoStatus = this.modal.find('.video-status');
				videoStatus.empty(); // 기존 상태 뱃지 제거
				videoStatus.append(statusBadge); // 새 상태 뱃지 추가
				
				// 통계 정보 업데이트
				this.modal.find('.video-stats-info .views').text(viewCount);
				this.modal.find('.video-stats-info .likes').text(likeCount);
				this.modal.find('.video-stats-info .comments').text(commentCount);
				this.modal.find('.video-stats-info .reports').text(reportCount);
				
				// 모달 표시
				this.modal.modal('show');

				// 비디오 로드 에러 처리
				modalVideo.on('error', () => {
						CommonAlerts.showError('비디오를 로드하는 중 오류가 발생했습니다.', '재생 오류');
				});
		}
};

// 필터 관리
const FilterManager = {
		init: function() {
				this.bindEvents();
		},

		bindEvents: function() {
				// 상태 필터 변경
				$('#statusFilter').on('change', () => {
						this.applyFilters();
				});

				// 신고 필터 변경
				$('#reportFilter').on('change', () => {
						this.applyFilters();
				});

				// 정렬 옵션 변경
				$('#sortFilter').on('change', () => {
						this.applyFilters();
				});
		},

		applyFilters: function() {
				const statusFilter = $('#statusFilter').val();
				const reportFilter = $('#reportFilter').val();
				const sortFilter = $('#sortFilter').val();

				console.log('Applying filters:', { statusFilter, reportFilter, sortFilter });

				// 모든 비디오 카드 표시
				$('.video-card').show();

				// 상태 필터 적용
				if (statusFilter) {
						$('.video-card').each(function() {
								const cardStatus = $(this).find('.content-status-badge').hasClass(`status-${statusFilter}`);
								if (!cardStatus) {
										$(this).hide();
								}
						});
				}

				// 신고 필터 적용
				if (reportFilter) {
						$('.video-card:visible').each(function() {
								const reportCount = parseInt($(this).find('.report-count').text().match(/\d+/)?.[0] || '0');
								if (reportFilter === 'reported' && reportCount === 0) {
										$(this).hide();
								} else if (reportFilter === 'not-reported' && reportCount > 0) {
										$(this).hide();
								}
						});
				}

				// 정렬 적용
				this.sortVideos(sortFilter);

				// 체크박스 상태 초기화
				CheckboxManager.updateSelectAllState();
				CheckboxManager.updateSelectedCount();
		},

		sortVideos: function(sortType) {
				const container = $('.video-card-container');
				const cards = container.children('.video-card:visible').get();

				cards.sort((a, b) => {
						const $a = $(a);
						const $b = $(b);

						switch (sortType) {
								case 'latest':
										return this.compareDates($b.find('.video-date').text(), $a.find('.video-date').text());
								case 'oldest':
										return this.compareDates($a.find('.video-date').text(), $b.find('.video-date').text());
								case 'views':
										return this.compareNumbers($b.find('.icon-eye').parent().text(), $a.find('.icon-eye').parent().text());
								case 'likes':
										return this.compareNumbers($b.find('.icon-heart').parent().text(), $a.find('.icon-heart').parent().text());
								case 'reports':
										return this.compareNumbers($b.find('.report-count').text(), $a.find('.report-count').text());
								default:
										return 0;
						}
				});

				container.append(cards);
		},

		compareDates: function(dateA, dateB) {
				return new Date(dateA) - new Date(dateB);
		},

		compareNumbers: function(a, b) {
				const numA = parseInt(a.match(/\d+/)?.[0] || '0');
				const numB = parseInt(b.match(/\d+/)?.[0] || '0');
				return numA - numB;
		}
};

// 체크박스 관리
const CheckboxManager = {
		init: function() {
				this.selectAllCheckbox = $('#selectAllCheckbox');
				this.bindEvents();
				this.updateSelectedCount();
		},

		bindEvents: function() {
				// 전체 선택 체크박스 클릭 이벤트
				this.selectAllCheckbox.on('click', (e) => {
						const isChecked = e.target.checked;
						$('.video-card:visible .custom-control-input').prop('checked', isChecked);
						this.updateSelectedCount();
				});

				// 개별 체크박스 클릭 이벤트
				$(document).on('click', '.custom-control-input', () => {
						this.updateSelectAllState();
						this.updateSelectedCount();
				});
		},

		updateSelectedCount: function() {
				const visibleCheckboxes = $('.video-card:visible .custom-control-input');
				const selectedCheckboxes = visibleCheckboxes.filter(':checked');
				const count = selectedCheckboxes.length;

				// 선택된 개수 업데이트
				$('.selected-count .count').text(count);

				// 벌크 액션 버튼 상태 업데이트
				$('#bulkWarning, #bulkBlock, #bulkDelete').prop('disabled', count === 0);
		},

		updateSelectAllState: function() {
				const visibleCheckboxes = $('.video-card:visible .custom-control-input');
				const selectedCheckboxes = visibleCheckboxes.filter(':checked');

				if (visibleCheckboxes.length === 0) {
						this.selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
				} else if (selectedCheckboxes.length === 0) {
						this.selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
				} else if (selectedCheckboxes.length === visibleCheckboxes.length) {
						this.selectAllCheckbox.prop('checked', true).prop('indeterminate', false);
				} else {
						this.selectAllCheckbox.prop('checked', false).prop('indeterminate', true);
				}
		}
};

// 페이지 로드 시 초기화
$(document).ready(function() {
	VideoPlayer.init();
	VideoModal.init();
	FilterManager.init();
	CheckboxManager.init();
});



