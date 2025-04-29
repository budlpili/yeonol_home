$(function() {
  class SalesManager {
    constructor() {
      this.table = null;
      this.statusClasses = {
        success: 'badge-success',
        completed: 'badge-completed',
        refunded: 'badge-danger'
      };
      this.statusTexts = {
        success: '결제완료',
        completed: '사용완료',
        refunded: '환불완료'
      };
      this.init();
    }

    init() {
      // DOM이 완전히 로드된 후 초기화
      $(document).ready(() => {
        this.initDataTable();
        this.initDateRangePicker();
        this.initModalHandlers();
        this.initStatusHandlers();
        this.initRefundButtons();
        this.initEventListeners();
      });
    }

    initDataTable() {
      try {
        if ($.fn.DataTable.isDataTable("#copy-print-csv")) {
          $("#copy-print-csv").DataTable().destroy();
        }

        this.table = $("#copy-print-csv").DataTable({
          dom: '<"dt-buttons"B><"clear">lfrtip',
          buttons: [
            {
              extend: 'copy',
              text: '복사',
              className: 'btn btn-outline-secondary',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
              }
            },
            {
              extend: 'excel',
              text: 'Excel',
              className: 'btn btn-outline-success',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
              }
            },
            {
              extend: 'csv',
              text: 'CSV',
              className: 'btn btn-outline-primary',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
              }
            },
            {
              extend: 'print',
              text: '인쇄',
              className: 'btn btn-outline-info',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7]
              }
            }
          ],
          language: {
            decimal: "",
            emptyTable: "데이터가 없습니다.",
            info: "총 _TOTAL_개 중 _START_-_END_",
            infoEmpty: "0개",
            infoFiltered: "(전체 _MAX_ 개 중 검색결과)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "_MENU_ 개씩 보기",
            loadingRecords: "로딩중...",
            processing: "처리중...",
            search: "검색:",
            zeroRecords: "검색된 데이터가 없습니다.",
            paginate: {
              first: "첫 페이지",
              last: "마지막 페이지",
              next: "다음",
              previous: "이전"
            }
          },
          pageLength: 10,
          lengthMenu: [
            [5, 10, 25, 50, 100],
            ["5개", "10개", "25개", "50개", "100개"]
          ],
          ordering: true,
          order: [[1, "desc"]],
          autoWidth: false,
          columnDefs: [
            { targets: 0, width: '12%' }, // 주문번호
            { targets: 1, width: '12%' }, // 결제일시
            { targets: 2, width: '15%' }, // 구매자
            { targets: 3, width: '12%' }, // 상품명
            { targets: 4, width: '8%' },  // 결제수단
            { targets: 5, width: '10%' }, // 결제금액
            { targets: 6, width: '10%' }, // 환불금액
            { targets: 7, width: '10%' }, // 상태
            { targets: 8, width: '11%' }  // 관리
          ]
        });

        // 초기화 성공 로그
        console.log("DataTable initialized successfully");

        // 버튼 컨테이너에 마진 추가
        $(".dt-buttons").addClass("mb-3");

      } catch (error) {
        console.error("Error initializing DataTable:", error);
      }
    }

    initEventListeners() {
      // 이벤트 위임을 사용하여 document에 한 번만 이벤트 리스너 등록
      document.addEventListener('click', (e) => {
        // 환불 버튼 클릭
        if (e.target.classList.contains('refund-order') && !e.target.classList.contains('disabled')) {
          e.preventDefault();
          this.handleRefund(e.target);
        }
        
        // 상세보기 버튼 클릭
        if (e.target.classList.contains('view-detail')) {
          e.preventDefault();
          this.handleViewDetail(e.target);
        }
      });
    }

    handleRefund(button) {
      // button을 jQuery 객체로 변환
      const $button = $(button);
      
      // 이미 처리 중인지 확인
      if ($button.data('processing') === 'true') {
        return;
      }
      
      // 처리 중 표시
      $button.data('processing', 'true');

      Swal.fire({
        title: '환불 처리',
        text: '정말 환불 처리하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      }).then((result) => {
        // 처리 완료 표시 제거
        $button.data('processing', 'false');
        
        // 확인 버튼을 눌렀을 때만 환불 처리 실행
        if (result.isConfirmed) {
          this.executeRefund($button);
        }
      });
    }

    executeRefund(button) {
      try {
        const $row = $(button).closest('tr');
        const $amountCell = $row.find('.payment-amount');
        const $refundAmountCell = $row.find('.refund-amount');
        const $statusContainer = $row.find('.payment-status-container');
        
        // 금액 계산
        const currentAmount = parseInt($amountCell.text().replace(/[^\d]/g, ''));
        const formattedRefundAmount = this.formatNumber(currentAmount);
        
        // 환불금액 셀 업데이트
        $refundAmountCell.empty(); // 기존 내용(버튼) 제거
        $refundAmountCell.text(`-₩${formattedRefundAmount}`);
        $refundAmountCell.addClass('text-danger');
        
        // 상태 업데이트
        $statusContainer.html('<span class="badge badge-danger">환불완료</span>');
        
        // DataTable 새로고침
        this.table.row($row).invalidate().draw(false);
        
        // 성공 메시지
        Swal.fire({
          title: '환불 완료',
          text: '성공적으로 환불처리되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'
        });
      } catch (error) {
        console.error('환불 처리 중 오류 발생:', error);
        Swal.fire({
          title: '오류 발생',
          text: '환불 처리 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonText: '확인'
        });
      }
    }

    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // DateRange 초기화
    initDateRangePicker() {
      var self = this;
      var start = moment().subtract(29, "days");
      var end = moment();

      $("#reportrange").daterangepicker(
        {
          startDate: start,
          endDate: end,
          ranges: {
            오늘: [moment(), moment()],
            어제: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            "지난 7일": [moment().subtract(6, "days"), moment()],
            "지난 30일": [moment().subtract(29, "days"), moment()],
            "이번 달": [moment().startOf("month"), moment().endOf("month")],
            "지난 달": [
              moment().subtract(1, "month").startOf("month"),
              moment().subtract(1, "month").endOf("month")
            ]
          },
          locale: {
            format: "YYYY-MM-DD",
            separator: " ~ ",
            applyLabel: "적용",
            cancelLabel: "취소",
            fromLabel: "시작일",
            toLabel: "종료일",
            customRangeLabel: "직접 선택",
            weekLabel: "주",
            daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
            monthNames: [
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월"
            ]
          }
        },
        function(start, end) {
          self.dateRangeCallback(start, end);
        }
      );

      this.updateDateRangeText(start, end);
    }

    // DateRange 콜백
    dateRangeCallback(start, end) {
      this.updateDateRangeText(start, end);
      var table = $("#copy-print-csv").DataTable();
      if (table) {
        table.draw();
      }
    }

    // DateRange 텍스트 업데이트
    updateDateRangeText(start, end) {
      $("#reportrange .range-text").html(
        start.format("YYYY년 MM월 DD일") + " ~ " + end.format("YYYY년 MM월 DD일")
      );
    }

    showOrderDetail(row) {
      // 주문 데이터 가져오기
      const orderData = {
        orderNumber: row.find(".order-number").text().trim(),
        orderDate: row.find(".order-date").text().trim(),
        paymentMethod: row.find(".payment-method").text().trim(),
        paymentAmount: row.find(".payment-amount").text().trim(),
        refundAmount: row.find(".refund-amount").text().trim(),
        isRefunded: row.find(".payment-status .badge-danger").length > 0,
        refundDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        refundAccount: {
          bank: "신한은행",
          number: "123-456-789012",
          holder: "홍길동"
        },
        customer: {
          name: row.find(".user-info span").text().trim(),
          image: row.find(".user-info img").attr('src'),
          id: row.find(".user-info").data('user-id') || '1',
          phone: "010-1234-5678",
          email: "example@email.com"
        },
        statuses: row.find(".payment-status .badge").map(function() {
          return $(this).text().trim();
        }).get()
      };

      console.log('주문 데이터:', orderData); // 데이터 확인용 로그

      // 기본 정보 표시
      $("#orderNumber").text(orderData.orderNumber);
      $("#orderDate").text(orderData.orderDate);
      $("#paymentMethod").text(orderData.paymentMethod);
      $("#paymentAmount").text(orderData.paymentAmount); // 결제금액 직접 표시

      // 결제/환불 정보 섹션 생성
      const paymentInfoHtml = `
        <div class="payment-section">
          ${orderData.isRefunded ? `
            <div class="refund-info">
              <h6 class="mb-2">환불 정보</h6>
              <div class="info-row">
                <span class="label">환불금액:</span>
                <span class="value text-danger">${orderData.refundAmount}</span>
              </div>
              <div class="info-row">
                <span class="label">환불일시:</span>
                <span class="value">${orderData.refundDate}</span>
              </div>
              <div class="info-row">
                <span class="label">환불계좌:</span>
                <span class="value">${orderData.refundAccount.bank} ${orderData.refundAccount.number} (${orderData.refundAccount.holder})</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // 결제 정보 영역 업데이트
      const paymentInfoWrapper = $("#paymentInfoWrapper");
      if (paymentInfoWrapper.length === 0) {
        $(".order-info").append(`<div id="paymentInfoWrapper">${paymentInfoHtml}</div>`);
      } else {
        paymentInfoWrapper.html(paymentInfoHtml);
      }

      // 구매자 정보 표시 (프로필 링크 추가)
      const customerInfoHtml = `
        <h5>구매자 정보</h5>
        <p>이름: 
          <a href="/user-detail.html?id=${orderData.customer.id}" class="user-profile-link">
            <img src="${orderData.customer.image}" alt="${orderData.customer.name}" class="avatar xs me-2">
            <span id="customerName">${orderData.customer.name}</span>
          </a>
        </p>
        <p>연락처: <span id="customerPhone">${orderData.customer.phone}</span></p>
        <p>이메일: <span id="customerEmail">${orderData.customer.email}</span></p>
      `;
      
      $(".customer-info").html(customerInfoHtml);

      // 상태 뱃지 표시
      const statusesHtml = this.getStatusBadgesHtml(orderData.statuses);
      const orderStatus = $("#orderStatus");
      if (orderStatus.length === 0) {
        $(".order-info").append(`
          <div class="order-status-wrapper mt-3">
            <p class="order-status mb-0">
              <span id="orderStatus" class="status-badges">${statusesHtml}</span>
            </p>
          </div>
        `);
      } else {
        orderStatus.html(statusesHtml);
      }

      // 모달 표시
      $("#orderDetailModal").modal("show");
    }

    getPaymentInfoHtml(amount, isRefunded, refundDate, refundAccount) {
      const formattedAmount = this.formatNumber(amount.toString().replace(/[,]/g, ''));
      return `
        <div class="payment-section">
          ${isRefunded ? `
            <div class="refund-info">
              <h6>환불 정보</h6>
              <div class="info-row">
                <span class="label">환불금액</span>
                <span class="value text-danger refund-amount">-${formattedAmount}</span>
              </div>
              <div class="info-row">
                <span class="label">환불일시</span>
                <span class="value">${refundDate}</span>
              </div>
              <div class="info-row">
                <span class="label">환불계좌</span>
                <span class="value">${refundAccount.bank} ${refundAccount.number} (${refundAccount.holder})</span>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    getStatusBadgesHtml(statuses) {
      // 환불완료 상태가 포함되어 있으면 환불완료 뱃지만 표시
      if (statuses.includes(this.statusTexts.refunded)) {
        return `<span class="badge ${this.statusClasses.refunded}">${this.statusTexts.refunded}</span>`;
      }

      // 그 외의 경우 모든 상태 표시
      return statuses.map(status => {
        let badgeClass = '';
        switch (status.trim()) {
          case '환불완료':
            badgeClass = 'badge-danger';
            break;
          case '사용완료':
            badgeClass = 'badge-orange';
            break;
          case '결제완료':
            badgeClass = 'badge-success';
            break;
          default:
            badgeClass = 'badge-secondary';
        }
        return `<span class="badge ${badgeClass} me-1">${status}</span>`;
      }).join(' ');
    }

    initStatusHandlers() {
      // 상태 변경 드롭다운 클릭 이벤트
      $(document).on('click', '.status-dropdown .dropdown-item', (e) => {
        const statusType = $(e.currentTarget).data('status');
        const statusBadge = $(e.currentTarget).closest('.status-dropdown').find('.badge');
        const row = $(e.currentTarget).closest('tr');
        
        this.changeStatus(statusBadge, statusType, row);
      });
    }

    changeStatus(badge, newStatus, row) {
      const previousStatus = this.getStatusType(badge);
      
      Swal.fire({
        title: '상태 변경',
        text: `${this.statusTexts[previousStatus]}에서 ${this.statusTexts[newStatus]}(으)로 변경하시겠습니까?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '변경',
        cancelButtonText: '취소',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeStatusUpdate(badge, newStatus, row);
        }
      });
    }

    executeStatusUpdate(badge, newStatus, row, showAlert = true) {
      // 이전 상태 클래스들 모두 제거
      Object.values(this.statusClasses).forEach(className => {
        badge.removeClass(className);
      });

      // 새로운 상태 클래스 추가
      badge.addClass(this.statusClasses[newStatus]);
      badge.text(this.statusTexts[newStatus]);

      // 환불완료 상태일 경우 금액 처리
      if (newStatus === 'refunded') {
        const amountElement = row.find(".payment-amount");
        const currentAmount = amountElement.text().replace(',', '').replace(',', '');
        if (!amountElement.text().startsWith('-')) {
          amountElement
            .text(`-${currentAmount}`)
            .addClass('text-danger');
        }
          // 환불 버튼 비활성화
        row.find(".refund-order")
          .prop("disabled", true)
          .addClass("disabled");
      }

      // 사용완료 상태일 경우 환불 버튼 비활성화
      if (newStatus === 'completed') {
        row.find(".refund-order")
          .prop("disabled", true)
          .addClass("disabled")
          .text("환불불가");
      }

      // 결제완료 상태로 되돌아갈 경우
      if (newStatus === 'success') {
        const amountElement = row.find(".payment-amount");
        const currentAmount = amountElement.text().replace(',', '').replace(',', '').replace(',', '');
        amountElement
          .text(`${currentAmount}`)
          .removeClass('text-danger');
        
        // 환불 버튼 활성화
        row.find(".refund-order")
          .prop("disabled", false)
          .removeClass("disabled");
      }

      if (showAlert) {
        Swal.fire({
          title: '완료',
          text: '상태가 변경되었습니다.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    }

    handleViewDetail(button) {
      // row를 jQuery 객체로 변환
      const row = $(button.closest('tr'));
      this.showOrderDetail(row);
    }

    // API 연동을 위한 메서드 (실제 구현 필요)
    async processRefund(orderNumber) {
      // 실제 환불 API 호출
      // const response = await fetch('/api/refund', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ orderNumber })
      // });
      // if (!response.ok) throw new Error('환불 처리 실패');
      // return await response.json();
    }

    // 환불 버튼 초기 상태 설정
    initRefundButtons() {
      $('.refund-order').each((i, button) => {
        const $row = $(button).closest('tr');
        const $statusBadges = $row.find('.payment-status .badge');
        
        if (this.hasCompletedStatus($statusBadges)) {
          // 사용완료 상태
          $(button)
            .text('환불불가')
            .addClass('disabled')
            .prop('disabled', true);
        } else if (this.hasRefundedStatus($statusBadges)) {
          // 환불완료 상태
          const amount = $row.find('.payment-amount').text().replace(/[^\d]/g, '');
          const formattedAmount = this.formatNumber(amount);
          const $refundCell = $row.find('.refund-amount');
          
          $refundCell.empty(); // 버튼 제거
          $refundCell.text(`-₩${formattedAmount}`);
          $refundCell.addClass('text-danger');
        }
      });
    }

    // 사용완료 상태 확인
    hasCompletedStatus(badges) {
      return badges.toArray().some(badge => 
        $(badge).hasClass(this.statusClasses.completed) || 
        $(badge).text().trim() === this.statusTexts.completed
      );
    }

    // 환불완료 상태 확인
    hasRefundedStatus(badges) {
      return badges.toArray().some(badge => 
        $(badge).hasClass(this.statusClasses.refunded) || 
        $(badge).text().trim() === this.statusTexts.refunded
      );
    }

    getStatusType(badge) {
      for (const [type, className] of Object.entries(this.statusClasses)) {
        if (badge.hasClass(className)) {
          return type;
        }
      }
      return 'success';
    }

    initModalHandlers() {
      const modal = $("#orderDetailModal");
      const mainContent = $("#wrapper");
      const self = this; // this 컨텍스트 저장

      modal.on("show.bs.modal", function() {
        mainContent.attr("inert", "");
        $("body > *:not(.modal)").attr("aria-hidden", "true");

        setTimeout(() => {
          const firstFocusable = $(this)
            .find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
            .first();
          firstFocusable.focus();
        }, 100);
      });

      modal.on("hidden.bs.modal", function() {
        mainContent.removeAttr("inert");
        $("body > *:not(.modal)").removeAttr("aria-hidden");
        $(this).find("button, input").blur();

        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }

        // clearModalData 메서드 호출
        self.clearModalData();
      });

      modal.on("keydown", function(e) {
        if (e.key === "Tab" || e.keyCode === 9) {
          const focusableElements = $(this).find(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusableElement = focusableElements[0];
          const lastFocusableElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              e.preventDefault();
              lastFocusableElement.focus();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              e.preventDefault();
              firstFocusableElement.focus();
            }
          }
        }

        if (e.key === "Escape") {
          modal.modal("hide");
        }
      });

      $(document).on("click", '[data-action="view-detail"]', function() {
        modal[0].lastFocusedElement = this;
      });
    }

    clearModalData() {
      $("#orderNumber").text("");
      $("#orderDate").text("");
      $("#paymentMethod").text("");
      $("#paymentAmount").text("");
      $("#customerName").text("");
      $("#customerPhone").text("");
      $("#customerEmail").text("");
    }
  }

  // 클래스 인스턴스 생성
  new SalesManager();
});
