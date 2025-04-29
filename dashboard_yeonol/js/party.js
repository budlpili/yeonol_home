document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.getElementById("partyMemberDropdown");
  const dropdownBtn = document.getElementById("partyMemberBtn");
  const dropdownContent = document.getElementById("partyMemberContent");
  const checkboxes = document.querySelectorAll(".party-checkbox");
  const btnText = dropdownBtn.querySelector(".party-btn-text");
  const countText = dropdownBtn.querySelector(".party-count");
  const bulkMessageBtn = document.getElementById("bulkMessageBtn");
  const bulkRemoveBtn = document.getElementById("bulkRemoveBtn");
  const totalUsers = checkboxes.length;

  if (dropdownBtn && dropdownContent) {
    // 드롭다운 버튼 클릭 이벤트
    dropdownBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownContent.classList.toggle("show");
      dropdown.classList.toggle("active"); // 화살표 회전을 위한 클래스 토글
    });

    // 외부 클릭시 드롭다운 닫기
    document.addEventListener("click", function(e) {
      if (!e.target.closest("#partyMemberDropdown")) {
        dropdownContent.classList.remove("show");
        dropdown.classList.remove("active"); // 화살표 원위치
      }
    });

    // 체크박스 변경 이벤트
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", function() {
        updateDropdownButton();
        updateBulkActions();
      });
    });

    // 아이템 버튼 클릭 이벤트
    // document.querySelectorAll(".party-item-btn").forEach(btn => {
    //   btn.addEventListener("click", function(e) {
    //     e.preventDefault();
    //     openUserProfileWindow();
    //   });
    // });

    // 드롭다운 메뉴 아이템 클릭 이벤트
    document.querySelectorAll(".party-item-dropdown-btn").forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        const userItem = this.closest(".custom-party-item");
        const userName = userItem.querySelector(".party-user-name").textContent;

        if (this.classList.contains("message")) {
          // 메시지 보내기
          alert(`${userName}님에게 메시지를 보냅니다.`);
        } else if (this.classList.contains("remove")) {
          // 강퇴하기
          if (confirm(`${userName}님을 강퇴하시겠습니까?`)) {
            alert(`${userName}님이 강퇴되었습니다.`);
          }
        }

        // 드롭다운 닫기
        this.closest(".party-item-dropdown").classList.remove("show");
      });
    });

    // 외부 클릭시 모든 드롭다운 닫기
    document.addEventListener("click", function(e) {
      if (!e.target.closest(".party-item-right")) {
        document.querySelectorAll(".party-item-dropdown").forEach(dropdown => {
          dropdown.classList.remove("show");
        });
      }
    });

    // 일괄 메시지 전송
    bulkMessageBtn.addEventListener("click", function() {
      const selectedUsers = getSelectedUsers();
      sendMessageToMultiple(selectedUsers);
    });

    // 일괄 강퇴
    bulkRemoveBtn.addEventListener("click", function() {
      const selectedUsers = getSelectedUsers();
      removeMultipleUsers(selectedUsers);
    });

    // 선택된 사용자 목록 가져오기
    function getSelectedUsers() {
      return Array.from(checkboxes).filter(cb => cb.checked).map(cb => {
        const userItem = cb.closest(".custom-party-item");
        return {
          name: userItem.querySelector(".party-user-name").textContent,
          email: userItem.querySelector(".party-user-email").textContent
        };
      });
    }

    // 드롭다운 버튼 텍스트 업데이트
    function updateDropdownButton() {
      const checkedBoxes = document.querySelectorAll(".party-checkbox:checked");
      const selectedCount = checkedBoxes.length;

      if (selectedCount === 0) {
        btnText.textContent = "참여자 선택";
      } else {
        const firstChecked = checkedBoxes[0];
        const userName = firstChecked
          .closest(".custom-party-item")
          .querySelector(".party-user-name").textContent;

        if (selectedCount === 1) {
          btnText.textContent = userName;
        } else {
          btnText.textContent = `${userName} 외 ${selectedCount - 1}명`;
        }
      }

      countText.textContent = `(${selectedCount}/${totalUsers}명)`;
    }

    // 일괄 액션 버튼 상태 업데이트
    function updateBulkActions() {
      const selectedCount = document.querySelectorAll(".party-checkbox:checked")
        .length;
      bulkMessageBtn.disabled = selectedCount === 0;
      bulkRemoveBtn.disabled = selectedCount === 0;
    }

    // 다중 메시지 전송 함수
    function sendMessageToMultiple(users) {
      const names = users.map(user => user.name).join(", ");
      alert(`선택된 사용자(${names})에게 메시지를 보냅니다.`);
    }

    // 다중 강퇴 함수
    function removeMultipleUsers(users) {
      const names = users.map(user => user.name).join(", ");
      if (confirm(`선택된 사용자(${names})를 강퇴하시겠습니까?`)) {
        alert(`선택된 사용자가 강퇴되었습니다.`);
      }
    }

    // 프로필 새 창 열기 함수
    function openUserProfileWindow() {
      const url = "user-profile-simple.html";
      const windowName = "UserProfile";
      const windowFeatures =
        "width=800,height=600,left=200,top=100,scrollbars=yes,resizable=yes";

      // 새 창 열기
      window.open(url, windowName, windowFeatures);
    }

    // 초기 상태 설정
    updateDropdownButton();
    updateBulkActions();
  }
});
