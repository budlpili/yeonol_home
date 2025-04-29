var options = {
  chart: {
    height: 300,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  series: [{
    name: '매출',
    data: [5000, 8000, 7000, 8000, 5000, 3000, 4000, 5000, 8000, 7000, 8000, 5000]
  }],
  grid: {
    row: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.2
    },
  },
  xaxis: {
    type: 'month',
    categories: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],                
  },
  colors: ['#666666', '#01902d'],
  markers: {
    size: 5,
    colors: ['#666666', '#01902d'],
    strokeColor: "#fff",
    strokeWidth: 2,
    hover: {
      size: 7,
    }
  },
}

var chart = new ApexCharts(
  document.querySelector("#income"),
  options
);

chart.render();
