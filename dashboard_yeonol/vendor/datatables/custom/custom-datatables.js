// Basic DataTable
$(function(){
	$('#basicExample').DataTable({
		'iDisplayLength': 4,
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
			"info": "Showing Page _PAGE_ of _PAGES_",
		}
	});
});



// FPrint/Copy/CSV
$(function(){
	window.salesTable = $('#copy-print-csv').DataTable({
		dom: '<"row"<"col-sm-12 col-md-12"l><"col-sm-12 col-md-12"f>>' +
			'<"row"<"col-sm-12"tr>>' +
			'<"row"<"col-sm-12 col-md-12"i><"col-sm-12 col-md-12"p>>' +
			'<"row mt-12"<"col-sm-12 text-right"B>>',
		buttons: [
			{
				extend: 'copy',
				text: '복사',
				className: 'btn btn-secondary'
			},
			{
				extend: 'excel',
				text: 'Excel',
				className: 'btn btn-success'
			},
			{
				extend: 'csv',
				text: 'CSV',
				className: 'btn btn-primary'
			},
			{
				extend: 'print',
				text: '인쇄',
				className: 'btn btn-info'
			}
		],
		pageLength: 10,
		lengthMenu: [[5, 10, 25, 50, 100], ['5개', '10개', '25개', '50개', '100개']],
		language: {
			"decimal": "",
			"emptyTable": "데이터가 없습니다",
			"info": "총 _TOTAL_개 중 _START_-_END_",
			"infoEmpty": "0개",
			"infoFiltered": "(전체 _MAX_ 개 중 검색결과)",
			"infoPostFix": "",
			"thousands": ",",
			"lengthMenu": "_MENU_ 씩 보기",
			"loadingRecords": "로딩중...",
			"processing": "처리중...",
			"search": "검색:",
			"zeroRecords": "검색된 데이터가 없습니다",
			"paginate": {
				"first": "«",
				"last": "»",
				"next": "›",
				"previous": "‹"
			}
		}
	});

	// 버튼 컨테이너 스타일링
	$('.dt-buttons').addClass('dt-buttons-bottom');
});


// Fixed Header
$(document).ready(function(){
	var table = $('#fixedHeader').DataTable({
		fixedHeader: true,
		'iDisplayLength': 4,
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
			"info": "Showing Page _PAGE_ of _PAGES_",
		}
	});
});


// Vertical Scroll
$(function(){
	$('#scrollVertical').DataTable({
		"scrollY": "207px",
		"scrollCollapse": true,
		"paging": false,
		"bInfo" : false,
	});
});



// Row Selection
$(function(){
	$('#rowSelection').DataTable({
		// 'iDisplayLength': 10,
		pageLength: 5,
		lengthMenu: [[5, 10, 25, 50, 100], ['5개', '10개', '25개', '50개', '100개']], // 표시 개수와 텍스트 매칭
		"language": {
			"lengthMenu": "_MENU_ 씩 보기",
			"info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
			"search": "검색:",
			"zeroRecords": "검색 결과가 없습니다",
			"paginate": {
				"first": "«",
				"last": "»",
				"next": "›",
				"previous": "‹"
			}
		},
		pagingType: 'full_numbers'  // 페이지네이션 타입 추가

	});
	var table = $('#rowSelection').DataTable();

	$('#rowSelection tbody').on( 'click', 'tr', function () {
		$(this).toggleClass('selected');
	});

	$('#button').on('click', function () {
		alert( table.rows('.selected').data().length +' row(s) selected' );
	});
});





$(function(){
	$('#highlightRowColumn').DataTable({
		pageLength: 10,
		lengthMenu: [[5, 10, 25, 50, 100], ['5개', '10개', '25개', '50개', '100개']],
		columnDefs: [
			{
				targets: 0,
				width: '78px',
				orderable: false // 체크박스 컬럼 정렬 비활성화
			},
			{
				targets: 2, // 비디오 컬럼
				orderable: false // 비디오 컬럼 정렬 비활성화
			}
		],
		language: {
			"lengthMenu": "_MENU_ 씩 보기",
			"info": "현재 _PAGE_ 페이지 / 총 _PAGES_ 페이지",
			"search": "검색:",
			"zeroRecords": "검색 결과가 없습니다",
			"paginate": {
				"first": "«",
				"last": "»",
				"next": "›",
				"previous": "‹"
			}
		},
		pagingType: 'full_numbers',
		order: [[1, 'asc']], // 두 번째 컬럼으로 기본 정렬
		responsive: true,
		initComplete: function() {
			var api = this.api();
			
			// 전체 선택 체크박스 이벤트
			$('.select-all-checkbox').on('click', function() {
				var isChecked = this.checked;
				$('.row-checkbox').prop('checked', isChecked);
				if(isChecked) {
					api.rows().nodes().to$().addClass('selected');
				} else {
					api.rows().nodes().to$().removeClass('selected');
				}
			});

			// 개별 체크박스 이벤트
			api.on('click', '.row-checkbox', function(e) {
				e.stopPropagation();
				var row = $(this).closest('tr');
				if(this.checked) {
					row.addClass('selected');
				} else {
					row.removeClass('selected');
				}
				
				// 전체 선택 체크박스 상태 업데이트
				var totalRows = $('.row-checkbox').length;
				var selectedRows = $('.row-checkbox:checked').length;
				$('.select-all-checkbox').prop('checked', totalRows === selectedRows);
			});
		}
	});

	// 하이라이트 효과
	var table = $('#highlightRowColumn').DataTable();
	$('#highlightRowColumn tbody').on('mouseenter', 'td', function() {
		if (!$(this).hasClass('video-column')) {
			var colIdx = table.cell(this).index().column;
			$(table.cells().nodes()).removeClass('highlight');
			$(table.column(colIdx).nodes()).addClass('highlight');
		}
	});
});


// Using API in callbacks
$(function(){
	$('#apiCallbacks').DataTable({
		'iDisplayLength': 4,
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
		},
		"initComplete": function(){
			var api = this.api();
			api.$('td').on('click', function(){
			api.search(this.innerHTML).draw();
		});
		}
	});
});


// Hiding Search and Show entries
$(function(){
	$('#hideSearchExample').DataTable({
		'iDisplayLength': 4,
		"searching": false,
		"language": {
			"lengthMenu": "Display _MENU_ Records Per Page",
			"info": "Showing Page _PAGE_ of _PAGES_",
		}
	});
});
