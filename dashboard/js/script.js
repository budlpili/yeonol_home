const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

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
const sideBar = document.querySelector('.sidebar');

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
