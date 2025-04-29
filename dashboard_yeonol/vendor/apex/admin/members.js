var options = {
  chart: {
    height: 280,
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
    },
  },
  dataLabels: {
    enabled: true
  },
  colors: ['#111315'],
  series: [{
    name: '남자',
    data: [44, 55, 41, 67, 22, 43, 21, 33, 49, 15, 26, 55]
  },{
    name: '여자',
    data: [13, 23, 20, 8, 13, 27, 36, 22, 54, 28, 31, 26]
  }],
  xaxis: {
    type: 'month',
    // categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  },
  legend: {
    offsetY: -7
  },
  fill: {
    opacity: 1
  },
  colors: ['#4F4CF5', '#F5874C'],
  tooltip: {
    y: {
      formatter: function(val) {
        return  "가입자 " + val + "명"
      }
    }
  },
}
var chart = new ApexCharts(
  document.querySelector("#members"),
  options
);
chart.render();


