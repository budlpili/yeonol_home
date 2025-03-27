

// drop down menu - 파티 채팅 드롭다운
const selectBtn2 = document.querySelector(".select-btn2"),
    items = document.querySelectorAll(".item2");
    selectBtn2.addEventListener("click", () => {
    selectBtn2.classList.toggle("open");
});
items.forEach(item2 => {
    item2.addEventListener("click", () => {
        item2.classList.toggle("checked");
        let checked = document.querySelectorAll(".checked"),
            btnText = document.querySelector(".btn-text");
        if (checked && checked.length > 0) {
            btnText.innerText = `참여회원 ${checked.length} 명을 선택했습니다.`;
        } else {
            btnText.innerText = "Select Language";
        }
    });
})