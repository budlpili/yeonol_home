// Custom Scroll for Sidebar
$(function() {
	// 모든 slimscroll 초기화 전에 실행
	// 기존 slimScrollDiv 제거 및 재초기화
	$('.sidebar-content, .item-scroll-wrap').each(function() {
		if ($(this).parent().is('.slimScrollDiv')) {
			$(this).parent().replaceWith(this);
			$(this).removeAttr('style');
		}
	});

	// Sidebar scroll
	$('.sidebar-content').slimscroll({
		height: '100vh',
		position: 'right',
		size: "7px",
		color: '#CFD8DC',
		alwaysVisible: false,
		distance: '0px',
		railVisible: false,
		railColor: "#222",
		railOpacity: 0.3,
		wheelStep: 10,
		touchScrollStep: 50,
		borderRadius: '3px'
	});

	// Item Scroll
	$('.item-scroll-wrap').slimscroll({
		height: '200px',
		position: 'right',
		size: "7px",
		color: '#CFD8DC',
		alwaysVisible: false,
		distance: '0px',
		railVisible: false,
		railColor: "#222",
		railOpacity: 0.3,
		wheelStep: 10,
		touchScrollStep: 50,
		borderRadius: '3px'
	});
});

// Custom Scroll
$(function() {
	$('.customScroll').slimScroll({
		height: "180px",
		color: '#e5e8f2',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Custom Scroll 2
$(function() {
	$('.customScroll2').slimScroll({
		height: "227px",
		color: '#eff1f5',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Custom Scroll 3
$(function() {
	$('.customScroll3').slimScroll({
		height: "218px",
		color: '#eff1f5',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Custom Scroll 4
$(function() {
	$('.customScroll4').slimScroll({
		height: "310px",
		color: '#eff1f5',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Custom Scroll 3
$(function() {
	$('.customScroll5').slimScroll({
		height: "250px",
		color: '#eff1f5',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Custom Scroll
$(function() {
	$('.sidebarNavScroll').slimScroll({
		height: "calc(100vh - 250px)",
		color: '#17202b',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
		position: 'left',
	});
});

// Chat App Page
// Chat Container Scroll
$(function() {
	$('.chatContainerScroll').slimscroll({
		height: '100%',
		position: 'right',
		size: "7px",
		color: '#CFD8DC'
	});
});

// Chat Users Container Scroll
$(function() {
	$('.usersContainerScroll').slimscroll({
		height: '100%',
		position: 'right',
		size: "7px",
		color: '#CFD8DC'
	});
});

// Tasks App Page
// Tasks Labels Container Scroll
$(function() {
	$('.lablesContainerScroll').slimScroll({
		height: "100%",
		color: '#e6ecf3',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
		position: 'left',
	});
});

// Tasks Container Scroll
$(function() {
	$('.tasksContainerScroll').slimScroll({
		height: "100%",
		color: '#e6ecf3',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Documents App Page
// Documents Labels Container Scroll
$(function() {
	$('.docTypeContainerScroll').slimScroll({
		height: "100%",
		color: '#e6ecf3',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
		position: 'left',
	});
});

// Documents Container Scroll
$(function() {
	$('.documentsContainerScroll').slimScroll({
		height: "100%",
		color: '#e6ecf3',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

$(function() {
	$('.hotelMapScroll').slimScroll({
		height: "350px",
		color: '#e5e8f2',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

$(function() {
	$('.projectLog').slimScroll({
		height: "170px",
		color: '#e5e8f2',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

$(function() {
	$('.fullHeight').slimScroll({
		height: "100%",
		color: '#e5e8f2',
		alwaysVisible: false,
		size: "5px",
		distance: '1px',
		railVisible: false,
		railColor: "#eff1f5",
		position: 'left',
	});
});

// Fixed Body Scroll
$(function() {
	$('.fixedBodyScroll').slimScroll({
		height: "100%",
		color: '#c7cdd4',
		alwaysVisible: false,
		size: "5px",
		distance: '3px',
		railVisible: false,
		railColor: "#eff1f5",
	});
});

// Custom Scroll bars
$(document).ready(function() {
	// Sidebar scroll
	if ($('.sidebar-wrapper').length) {
		const sidebarContent = document.querySelector('.sidebar-content');
		if (sidebarContent) {
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					const sidebarWrapper = entry.target.closest('.sidebar-wrapper');
					if (sidebarWrapper) {
						initializeScroll(sidebarWrapper);
					}
				}
			});

			resizeObserver.observe(sidebarContent);
			initializeScroll(document.querySelector('.sidebar-wrapper'));
		}
	}

	// Messages scroll
	if ($('.messages-nav').length) {
		const messagesNav = document.querySelector('.messages-nav');
		if (messagesNav) {
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					initializeScroll(entry.target);
				}
			});

			resizeObserver.observe(messagesNav);
			initializeScroll(messagesNav);
		}
	}

	// Tasks scroll
	if ($('.tasks-wrapper').length) {
		const tasksWrapper = document.querySelector('.tasks-wrapper');
		if (tasksWrapper) {
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					initializeScroll(entry.target);
				}
			});

			resizeObserver.observe(tasksWrapper);
			initializeScroll(tasksWrapper);
		}
	}

	// Settings scroll
	if ($('.settings-wrapper').length) {
		const settingsWrapper = document.querySelector('.settings-wrapper');
		if (settingsWrapper) {
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					initializeScroll(entry.target);
				}
			});

			resizeObserver.observe(settingsWrapper);
			initializeScroll(settingsWrapper);
		}
	}

	// Teams scroll
	if ($('.team-wrapper').length) {
		const teamWrapper = document.querySelector('.team-wrapper');
		if (teamWrapper) {
			const resizeObserver = new ResizeObserver(entries => {
				for (let entry of entries) {
					initializeScroll(entry.target);
				}
			});

			resizeObserver.observe(teamWrapper);
			initializeScroll(teamWrapper);
		}
	}
});

function initializeScroll(element) {
	if (!element) return;

	// 기존 슬림스크롤 인스턴스 제거
	$(element).slimScroll({ destroy: true });

	// 새로운 슬림스크롤 설정
	$(element).slimScroll({
		height: 'auto',
		position: 'right',
		size: '5px',
		color: '#D4D4D4',
		opacity: .9,
		wheelStep: 5,
		touchScrollStep: 50
	});
}

// 윈도우 리사이즈 이벤트 처리
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		// 사이드바 스크롤 재초기화
		if ($('.sidebar-wrapper').length) {
			initializeScroll(document.querySelector('.sidebar-wrapper'));
		}

		// 메시지 스크롤 재초기화
		if ($('.messages-nav').length) {
			initializeScroll(document.querySelector('.messages-nav'));
		}

		// 작업 스크롤 재초기화
		if ($('.tasks-wrapper').length) {
			initializeScroll(document.querySelector('.tasks-wrapper'));
		}

		// 설정 스크롤 재초기화
		if ($('.settings-wrapper').length) {
			initializeScroll(document.querySelector('.settings-wrapper'));
		}

		// 팀 스크롤 재초기화
		if ($('.team-wrapper').length) {
			initializeScroll(document.querySelector('.team-wrapper'));
		}
	}, 250);
});

	// 윈도우 리사이즈 이벤트 처리
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {

