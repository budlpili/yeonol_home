// 탭 기능 구현
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 모든 탭 버튼에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 클릭된 버튼에 active 클래스 추가
            button.classList.add('active');
            
            // 모든 탭 패널 숨기기
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // 선택된 탭 패널 표시
            const targetTab = button.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}); 