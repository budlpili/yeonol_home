// text editor

let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

//List of fontlist
let fontList = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "cursive",
];

//Initial Settings
const initializer = () => {
    //function calls for highlighting buttons
    //No highlights for link, unlink,lists, undo,redo since they are one time operations
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);

    //create options for font names
    fontList.map((value) => {
        let option = document.createElement("option");
        option.value = value;
        option.innerHTML = value;
        if(fontName) {
            fontName.appendChild(option);
        }
    });

    //fontSize allows only till 7
    for (let i = 1; i <= 7; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        if(fontSizeRef) {
            fontSizeRef.appendChild(option);
        }
    }

    //default size
    if(fontSizeRef)  {
        fontSizeRef.value = 3;
    }

    // 드롭다운 이벤트 리스너 설정
    setupDropdownListeners();
};

// 드롭다운 이벤트 리스너 설정
function setupDropdownListeners() {
    // 드롭다운 버튼 클릭 이벤트
    const dropbtnClicks = document.querySelectorAll('.dropbtn_click');
    dropbtnClicks.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdownContent = btn.closest('.dropdown').querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.toggle('show');
            }
        });
    });

    // 카테고리 선택 이벤트
    const dataclassItems = document.querySelectorAll('.dataclass');
    dataclassItems.forEach(item => {
        item.addEventListener('click', () => {
            const dropdownContent = item.closest('.dropdown-content');
            const dropbtnContent = item.closest('.dropdown').querySelector('.dropbtn_content');
            if (dropbtnContent) {
                dropbtnContent.textContent = item.innerText;
            }
            if (dropdownContent) {
                dropdownContent.classList.remove('show');
            }
        });
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });
}

//main logic
const modifyText = (command, defaultUi, value) => {
    //execCommand executes command on selected text
    document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        modifyText(button.id, false, null);
    });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, button.value);
    });
});

//link
if(linkButton) {
    linkButton.addEventListener("click", () => {
        let userLink = prompt("Enter a URL");
        //if link has http then pass directly else add https
        if (/http/i.test(userLink)) {
            modifyText(linkButton.id, false, userLink);
        } else {
            userLink = "http://" + userLink;
            modifyText(linkButton.id, false, userLink);
        }
    });
}

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            //needsRemoval = true means only one button should be highlight and other would be normal
            if (needsRemoval) {
                let alreadyActive = false;

                //If currently clicked button is already active
                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }

                //Remove highlight from other buttons
                highlighterRemover(className);
                if (!alreadyActive) {
                    //highlight clicked button
                    button.classList.add("active");
                }
            } else {
                //if other buttons can be highlighted
                button.classList.toggle("active");
            }
        });
    });
};

const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};

// 드롭다운 관련 기능
function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.classList.toggle('show');
    }
}

function selectCategory(value) {
    const dropbtnContent = document.querySelector('.dropbtn_content');
    if (dropbtnContent) {
        dropbtnContent.textContent = value;
    }
    toggleDropdown();
}

// 초기화
window.addEventListener('load', initializer);
