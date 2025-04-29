// Daterange
$(function() {
	var start = moment().subtract(29, 'days');
	var end = moment();
	function cb(start, end) {
		$('#reportrange span').html(start.format('YYYY년 MM월 DD일') + ' - ' + end.format('YYYY년 MM월 DD일'));
	}
	$('#reportrange').daterangepicker({
		opens: 'left',
		locale: {
			applyLabel: '적용',
			cancelLabel: '취소',
			fromLabel: '시작일',
			toLabel: '종료일',
			customRangeLabel: '커스텀 기간'
		},
		startDate: start,
		endDate: end,
		ranges: {
			'오늘': [moment(), moment()],
			'어제': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'최근 7일': [moment().subtract(6, 'days'), moment()],
			'최근 30일': [moment().subtract(29, 'days'), moment()],
			'지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, cb);
	cb(start, end);
});