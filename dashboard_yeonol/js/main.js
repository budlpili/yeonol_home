// 전역 스코프 오염 방지
(function() {
	// Todays Date
	$(function() {
		var interval = setInterval(function() {
			var momentNow = moment();
			$('#today-date').html(momentNow.format('DD') + ' ' + ' '
			+ momentNow.format('- dddd').substring(0, 12));
		}, 100);
	});


	$(function() {
		var interval = setInterval(function() {
			var momentNow = moment();
			$('#todays-date').html(momentNow.format('DD MMMM YYYY'));
		}, 100);
	});


	// Loading
	$(function() {
		$("#loading-wrapper").fadeOut(100);
	});



	// Textarea characters left
	$(function() {
		$('#characterLeft').text('140 characters left');
		$('#message').keydown(function () {
			var max = 140;
			var len = $(this).val().length;
			if (len >= max) {
				$('#characterLeft').text('You have reached the limit');
				$('#characterLeft').addClass('red');
				$('#btnSubmit').addClass('disabled');            
			} 
			else {
				var ch = max - len;
				$('#characterLeft').text(ch + ' characters left');
				$('#btnSubmit').removeClass('disabled');
				$('#characterLeft').removeClass('red');            
			}
		});
	});



	// Todo list
	$('.todo-body').on('click', 'li.todo-list', function() {
		$(this).toggleClass('done');
	});



	// Tasks
	(function($) {
		var checkList = $('.task-checkbox'),
		toDoCheck = checkList.children('input[type="checkbox"]');
		toDoCheck.each(function(index, element) {
			var $this = $(element),
			taskItem = $this.closest('.task-block');
			$this.on('click', function(e) {
				taskItem.toggleClass('task-checked');
			});
		});
	})(jQuery);



	// Tasks Important Active
	$('.task-actions').on('click', '.important', function() {
		$(this).toggleClass('active');
	});



	// Tasks Important Active
	$('.task-actions').on('click', '.star', function() {
		$(this).toggleClass('active');
	});



	// Countdown
	$(document).ready(function(){
	  countdown();
	  setInterval(countdown, 1000);
	  function countdown () {
	  var now = moment(), // get the current moment
		// May 28, 2013 @ 12:00AM
		then = moment([2020, 10, 7]),
		// get the difference from now to then in ms
		ms = then.diff(now, 'milliseconds', true);
		// If you need years, uncomment this line and make sure you add it to the concatonated phrase
		/*
		years = Math.floor(moment.duration(ms).asYears());
		then = then.subtract('years', years);
		*/
		// update the duration in ms
		ms = then.diff(now, 'milliseconds', true);
		// get the duration as months and round down
		// months = Math.floor(moment.duration(ms).asMonths());
	 
		// // subtract months from the original moment (not sure why I had to offset by 1 day)
		// then = then.subtract('months', months).subtract('days', 1);
		// update the duration in ms
		ms = then.diff(now, 'milliseconds', true);
		days = Math.floor(moment.duration(ms).asDays());
	 
		then = then.subtract(days, 'days');
		// update the duration in ms
		ms = then.diff(now, 'milliseconds', true);
		hours = Math.floor(moment.duration(ms).asHours());
	 
		then = then.subtract(hours, 'hours');
		// update the duration in ms
		ms = then.diff(now, 'milliseconds', true);
		minutes = Math.floor(moment.duration(ms).asMinutes());
	 
		then = then.subtract(minutes, 'minutes');
		// update the duration in ms
		ms = then.diff(now, 'milliseconds', true);
		seconds = Math.floor(moment.duration(ms).asSeconds());
		
		// concatonate the variables
		diff = '<div class="num">' + days + ' <span class="text"> Days Left</span></div>';
		$('#daysLeft').html(diff);
	  }

	});


	// Bootstrap JS ***********

	// Tooltip
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})

	$(function () {
		$('[data-toggle="popover"]').popover()
	})



	// Custom Sidebar JS
	jQuery(function ($) {

		// Dropdown menu
		$(".sidebar-dropdown > a").click(function () {
			$(".sidebar-submenu").slideUp(200);
			if ($(this).parent().hasClass("active")) {
				$(".sidebar-dropdown").removeClass("active");
				$(this).parent().removeClass("active");
			} else {
				$(".sidebar-dropdown").removeClass("active");
				$(this).next(".sidebar-submenu").slideDown(200);
				$(this).parent().addClass("active");
			}
		});



		//toggle sidebar
		$("#toggle-sidebar").click(function () {
			$(".page-wrapper").toggleClass("toggled");
		});



		// Pin sidebar on click
		$("#pin-sidebar").click(function () {
			if ($(".page-wrapper").hasClass("pinned")) {
				// unpin sidebar when hovered
				$(".page-wrapper").removeClass("pinned");
				$("#sidebar").unbind( "hover");
			} else {
				$(".page-wrapper").addClass("pinned");
				$("#sidebar").hover(
					function () {
						console.log("mouseenter");
						$(".page-wrapper").addClass("sidebar-hovered");
					},
					function () {
						console.log("mouseout");
						$(".page-wrapper").removeClass("sidebar-hovered");
					}
				)
			}
		});



		// Pinned sidebar
		$(function() {
			$(".page-wrapper").hasClass("pinned");
			$("#sidebar").hover(
				function () {
					console.log("mouseenter");
					$(".page-wrapper").addClass("sidebar-hovered");
				},
				function () {
					console.log("mouseout");
					$(".page-wrapper").removeClass("sidebar-hovered");
				}
			)
		});




		// Toggle sidebar overlay
		$("#overlay").click(function () {
			$(".page-wrapper").toggleClass("toggled");
		});



		// Added by Srinu 
		$(function(){
			// When the window is resized, 
			$(window).resize(function(){
				// When the width and height meet your specific requirements or lower
				if ($(window).width() <= 768){
					$(".page-wrapper").removeClass("pinned");
				}
			});
			// When the window is resized, 
			$(window).resize(function(){
				// When the width and height meet your specific requirements or lower
				if ($(window).width() >= 768){
					$(".page-wrapper").removeClass("toggled");
				}
			});
		});


	});




	// 드롭다운 메뉴 추가
	document.addEventListener('DOMContentLoaded', function() {
		// 상태 카운트를 저장할 객체
		const statusCounts = {
			pending: 0,    // 인증보류
			notApproved: 0 // 미승인
		};

		// 드롭다운 초기화 및 이벤트 바인딩
		const dropdowns = document.querySelectorAll('.custom-dropdown');
		
		if (dropdowns.length > 0) {
			dropdowns.forEach(dropdown => {
				const button = dropdown.querySelector('.custom-dropdown-btn');
				const content = dropdown.querySelector('.dropdown-content');
				
				// 초기 상태 확인 및 카운트
				const currentStatus = button.textContent.trim();
				if (currentStatus === '인증보류') {
					statusCounts.pending++;
				} else if (currentStatus === '미승인') {
					statusCounts.notApproved++;
				}
				
				button.addEventListener('click', function(e) {
					e.stopPropagation();
					
					// 다른 드롭다운 닫기
					dropdowns.forEach(otherDropdown => {
						if (otherDropdown !== dropdown) {
							const otherContent = otherDropdown.querySelector('.dropdown-content');
							if (otherContent) {
								otherContent.classList.remove('show');
							}
						}
					});
					
					content.classList.toggle('show');
				});
				
				const items = content.querySelectorAll('.dropdown-item');
				items.forEach(item => {
					item.addEventListener('click', function(e) {
						const prevStatus = button.textContent.trim();
						const newStatus = this.textContent.trim();
						
						// 이전 상태 카운트 감소
						if (prevStatus === '인증보류') {
							statusCounts.pending--;
						} else if (prevStatus === '미승인') {
							statusCounts.notApproved--;
						}
						
						// 새로운 상태 카운트 증가
						if (newStatus === '인증보류') {
							statusCounts.pending++;
						} else if (newStatus === '미승인') {
							statusCounts.notApproved++;
						}
						
						button.textContent = newStatus;
						content.classList.remove('show');
						dropdown.classList.remove('active');
						
						// 카운트 업데이트
						updateStatusCounts();
						
						e.stopPropagation();
					});
				});
			});
			
			// 상태 카운트 업데이트 함수
			function updateStatusCounts() {
				document.querySelector('#unapprovedCount .count').textContent = statusCounts.notApproved;
				document.querySelector('#pendingCount .count').textContent = statusCounts.pending;
			}
			
			// 초기 카운트 표시
			updateStatusCounts();
			
			// 문서 클릭 시 모든 드롭다운 닫기
			document.addEventListener('click', function(e) {
				if (!e.target.closest('.custom-dropdown')) {
					dropdowns.forEach(dropdown => {
						const content = dropdown.querySelector('.dropdown-content');
						if (content) {
							content.classList.remove('show');
						}
					});
				}
			});
		}
	});

	// slimScrollDiv 인라인 스타일 제거
	$(document).ready(function() {
		$('.slimScrollDiv').each(function() {
			$(this).removeAttr('style');
		});
	});

	// 페이지 로드 후 실행될 JavaScript 코드
	$(document).ready(function() {
		// 경고 메시지 전송 버튼 클릭 이벤트
		$('#sendWarning').click(function() {
			const selectedWarning = $('input[name="warningMessage"]:checked').val();
			if (selectedWarning) {
				// 경고 메시지를 채팅창에 추가
				const warningMessage = `
					<li class='chat-center'>
						<div class='chat-text warning-message'>
							<div class='warning-message-content'>
								<p>[관리자 경고]<br></p>
								<span>${selectedWarning}</span>
								</div>
								<div class='chat-hour'>${moment().format('HH:mm')} </div>
						</div>
						<div class='chat-avatar'></div>
					</li>
				`;
				
				$('.chat-box').append(warningMessage);
				
				// 채팅창 스크롤을 최하단으로 이동
				$('.users-scrollwrap').scrollTop($('.chat-box').height());
				
				// 모달 닫기
				$('#warningModal').modal('hide');
				
				// 라디오 버튼 선택 해제
				$('input[name="warningMessage"]').prop('checked', false);
			}
		});

		// 프로필 클릭 이벤트
		$('.active-user-info').click(function(e) {
			e.preventDefault();
			$('#quickProfileModal').modal('show');
		});

		// 상세 프로필 버튼 클릭 이벤트
		$('#quickProfileModal').on('click', '.btn-primary', function() {
			// 새 탭에서 프로필 페이지 열기
			window.open('user-profile.html', '_blank');
		});
	});

	// 전역 함수로 선언
	window.selectJewelOption = function(element, amount, price) {
		// 이전 선택 제거
		document.querySelectorAll('.jewel-option').forEach(opt => {
			opt.classList.remove('selected');
		});
		
		// 현재 선택 표시
		element.classList.add('selected');
		
		// 충전 확인 다이얼로그
		Swal.fire({
			title: '보석 충전 확인',
			html: `
				<div class="charge-confirm-info">
					<p>선택하신 보석 개수: <strong>${amount}개</strong></p>
					<p>결제 금액: <strong>${price}원</strong></p>
				</div>
			`,
			icon: 'info',
			showCancelButton: true,
			confirmButtonText: '충전하기',
			cancelButtonText: '취소',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33'
		}).then((result) => {
			if (result.isConfirmed) {
				// 충전 처리 로직
				Swal.fire({
					title: '충전 완료!',
					html: `${amount}개의 보석이 충전되었습니다.`,
					icon: 'success',
					confirmButtonText: '확인'
				}).then(() => {
					// 현재 보석 개수 업데이트
					const currentJewels = parseInt($('.count-jewelry').text());
					const newAmount = currentJewels + amount;
					$('.count-jewelry').text(newAmount + ' 개');
				});
			}
		});
	};

	// 보석 충전 관련 기능
	document.addEventListener('DOMContentLoaded', function() {
		const chargeBtn = document.getElementById('chargeJewelBtn');
		
		// 충전하기 버튼 클릭 시 SweetAlert로 입력 폼 표시
		chargeBtn.addEventListener('click', function() {
			Swal.fire({
				title: '보석 충전',
				html: `
					<div class="jewel-charge-form">
						<div class="jewel-icon">
							<img src="img/bosuk.png" alt="보석">
						</div>
						<div class="input-group">
							<input type="number" id="jewelAmount" class="swal2-input" placeholder="보석 개수 입력" min="1">
							<span class="input-group-text">개</span>
						</div>
						<div class="current-jewel">
							현재 보석: <span class="current-amount">${$('.count-jewelry').text()}</span>
						</div>
					</div>
				`,
				showCancelButton: true,
				confirmButtonText: '충전하기',
				cancelButtonText: '취소',
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				preConfirm: () => {
					const amount = document.getElementById('jewelAmount').value;
					if (!amount || amount <= 0) {
						Swal.showValidationMessage('올바른 보석 개수를 입력해주세요');
					}
					return amount;
				}
			}).then((result) => {
				if (result.isConfirmed) {
					const amount = parseInt(result.value);
					
					// 충전 확인 다이얼로그
					Swal.fire({
						title: '보석 충전 확인',
						html: `
							<div class="charge-confirm-info">
								<img src="img/bosuk.png" alt="보석">
								<p><strong>${amount.toLocaleString()}개</strong>의 보석을 충전하시겠습니까?</p>
							</div>
						`,
						icon: 'question',
						showCancelButton: true,
						confirmButtonText: '충전하기',
						cancelButtonText: '취소',
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33'
					}).then((confirmResult) => {
						if (confirmResult.isConfirmed) {
							// 충전 완료 처리
							const currentJewels = parseInt($('.count-jewelry').text());
							const newAmount = currentJewels + amount;
							
							// 충전 완료 메시지
							Swal.fire({
								title: '충전 완료!',
								html: `
									<div class="charge-success-info">
										<img src="img/bosuk.png" alt="보석">
										<p><strong>${amount.toLocaleString()}개</strong>의 보석이 충전되었습니다.</p>
										<p>현재 보석: <strong>${newAmount.toLocaleString()}개</strong></p>
									</div>
								`,
								icon: 'success',
								confirmButtonText: '확인'
							});

							// 보석 개수 업데이트
							$('.count-jewelry').text(newAmount + ' 개');
						}
					});
				}
			});
		});
	});

	document.addEventListener('DOMContentLoaded', function() {
		const approvalSelect = document.querySelector('.count-select select');
		const approvedBtn = document.querySelector('.approved-btn');
		
		function updateButtonState() {
			const selectedValue = approvalSelect.value;
			const notApprovedCount = parseInt(document.querySelector('#unapprovedCount .count').textContent);
			const pendingCount = parseInt(document.querySelector('#pendingCount .count').textContent);
			const totalCount = notApprovedCount + pendingCount;
			
			console.log('미승인 카운트:', notApprovedCount);
			console.log('인증보류 카운트:', pendingCount);
			console.log('전체 카운트:', totalCount);
			console.log('선택된 값:', selectedValue);
			
			approvedBtn.disabled = true;
			approvedBtn.classList.add('disabled');
			
			if (selectedValue === '1' && totalCount > 0) {
				approvedBtn.disabled = false;
				approvedBtn.classList.remove('disabled');
			} else if (selectedValue === '2' && totalCount === 0) {
				approvedBtn.disabled = false;
				approvedBtn.classList.remove('disabled');
			}
		}
		
		approvedBtn.addEventListener('click', function() {
			if (this.disabled) return;
			
			try {
				// 전체 카운트 라벨 가져오기
				const notApprovedElement = document.querySelector('#unapprovedCount');
				const pendingElement = document.querySelector('#pendingCount');
				
				// dropdown-label 가져오기 - 선택자 수정
				const notApprovedLabels = Array.from(document.querySelectorAll('.custom-dropdown .dropdown-btn-wrap button'))
					.filter(btn => btn.textContent.trim() === '미승인')
					.map(btn => {
						const wrapper = btn.closest('.dropdown-wrapper');
						return wrapper.querySelector('.dropdown-label').textContent.trim();
					});
					
				const pendingLabels = Array.from(document.querySelectorAll('.custom-dropdown .dropdown-btn-wrap button'))
					.filter(btn => btn.textContent.trim() === '인증보류')
					.map(btn => {
						const wrapper = btn.closest('.dropdown-wrapper');
						return wrapper.querySelector('.dropdown-label').textContent.trim();
					});

				if (!notApprovedElement || !pendingElement) {
					throw new Error('필요한 요소를 찾을 수 없습니다.');
				}

				// 전체 텍스트와 카운트
				const notApprovedText = notApprovedElement.textContent;
				const pendingText = pendingElement.textContent;

				console.log('미승인 라벨:', notApprovedLabels);
				console.log('인증보류 라벨:', pendingLabels);
				
				// 기본 메시지 설정
				const message = `
					<div class="approval-message-form">
						<div class="items-list">
							<div class="status-message">다음 항목의 인증이 필요합니다.</div>
							<div class="items-group">
								<div class="items-label">
									☞${notApprovedText}
								</div>
								<div class="items-content">
									${notApprovedLabels.map(label => `<span class="item-tag">${label}</span>`).join('')}
								</div>
							</div>
							<div class="items-group">
								<div class="items-label">
									☞${pendingText}
								</div>
								<div class="items-content">
									${pendingLabels.map(label => `<span class="item-tag">${label}</span>`).join('')}
								</div>
							</div>
						</div>
						<div class="message-input-wrap">
							<textarea id="customMessage" class="swal2-textarea" 
								placeholder="추가 메시지를 입력하세요"></textarea>
						</div>
					</div>
				`;

				// SweetAlert 다이얼로그 표시
				Swal.fire({
					title: '프로필 상태 메시지 전송',
					html: message,
					showCancelButton: true,
					confirmButtonText: '전송',
					cancelButtonText: '취소'
				}).then((result) => {
					if (result.isConfirmed) {
						Swal.fire('전송 완료', '메시지가 전송되었습니다.', 'success');
					}
				});
			} catch (error) {
				console.error('Error:', error);
				alert('오류가 발생했습니다: ' + error.message);
			}
		});

		updateButtonState();
		approvalSelect.addEventListener('change', updateButtonState);
	});

	// 직접 입력 선택 시 textarea 표시/숨김 처리
	window.updateCustomMessage = function() {
		const messageSelect = document.getElementById('approvalMessageSelect');
		const customMessage = document.getElementById('customMessage');
		
		if (messageSelect.value === 'custom') {
			customMessage.style.display = 'block';
		} else {
			customMessage.style.display = 'none';
		}
	};

	// 로그아웃 버튼 이벤트 핸들러
	document.addEventListener('DOMContentLoaded', function() {
		const logoutBtn = document.getElementById('logoutBtn');
		
		if (logoutBtn) {
			logoutBtn.addEventListener('click', function(e) {
				e.preventDefault(); // 기본 링크 동작 방지
				
				Swal.fire({
					title: '로그아웃',
					text: '로그아웃 하시겠습니까?',
					icon: 'question',
					showCancelButton: true,
					confirmButtonText: '확인',
					cancelButtonText: '취소'
				}).then((result) => {
					if (result.isConfirmed) {
						// 로컬 스토리지에서 저장된 로그인 정보 삭제 (선택사항)
						localStorage.removeItem('savedId');
						localStorage.removeItem('savedPw');
						
						// login.html로 리다이렉트
						window.location.href = 'login.html';
					}
				});
			});
		}
	});

})(); // IIFE 종료

