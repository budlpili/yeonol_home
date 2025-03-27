

// drop down menu1 - 국적
const optionMenu = document.querySelector("#select-01"),
    selectBtn = optionMenu.querySelector("#select-btn-01"),
    options = optionMenu.querySelectorAll("#option-01"),
    sBtn_text = optionMenu.querySelector("#sBtn-text-01");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector("#option-text-01").innerText;
        
        sBtn_text.innerText = selectedOption;

        optionMenu.classList.remove("active");
    });
});

// drop down menu2 - 지역
const optionMenu02 = document.querySelector("#select-02"),
    selectBtn02 = optionMenu02.querySelector("#select-btn-02"),
    options02 = optionMenu02.querySelectorAll("#option-02"),
    sBtn_text02 = optionMenu02.querySelector("#sBtn-text-02");

selectBtn02.addEventListener("click", () => optionMenu02.classList.toggle("active"));

options02.forEach(option02 => {
    option02.addEventListener("click", () => {
        let selectedOption02 = option02.querySelector("#option-text-02").innerText;
        sBtn_text02.innerText = selectedOption02;
        console.log(selectedOption02);
        
        const data = {
            uid: $("#uid").val(),
            region: selectedOption02,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateRegion",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("지역변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu02.classList.remove("active");
    });
});

// drop down menu3 - 학력
const optionMenu03 = document.querySelector("#select-03"),
    selectBtn03 = optionMenu03.querySelector("#select-btn-03"),
    options03 = optionMenu03.querySelectorAll("#option-03"),
    sBtn_text03 = optionMenu03.querySelector("#sBtn-text-03");

selectBtn03.addEventListener("click", () => optionMenu03.classList.toggle("active"));

options03.forEach(option03 => {
    option03.addEventListener("click", () => {
        let selectedOption03 = option03.querySelector("#option-text-03").innerText;
        sBtn_text03.innerText = selectedOption03;
        
        const data = {
            uid: $("#uid").val(),
            edu: selectedOption03,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateEducation",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("학력이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu03.classList.remove("active");
    });
});


// drop down menu4 - 직업
const optionMenu04 = document.querySelector("#select-04"),
    selectBtn04 = optionMenu04.querySelector("#select-btn-04"),
    options04 = optionMenu04.querySelectorAll("#option-04"),
    sBtn_text04 = optionMenu04.querySelector("#sBtn-text-04");

selectBtn04.addEventListener("click", () => optionMenu04.classList.toggle("active"));

options04.forEach(option04 => {
    option04.addEventListener("click", () => {
        let selectedOption04 = option04.querySelector("#option-text-04").innerText;
        sBtn_text04.innerText = selectedOption04;
        
        const data = {
            uid: $("#uid").val(),
            job: selectedOption04,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateJob",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("직업이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu04.classList.remove("active");
    });
});

// drop down menu4 - 키
const optionMenu041 = document.querySelector("#select-04-1"),
    selectBtn041 = optionMenu041.querySelector("#select-btn-04-1"),
    options041 = optionMenu041.querySelectorAll("#option-04-1"),
    sBtn_text041 = optionMenu041.querySelector("#sBtn-text-04-1");

selectBtn041.addEventListener("click", () => optionMenu041.classList.toggle("active"));

options041.forEach(option041 => {
    option041.addEventListener("click", () => {
        let selectedOption041 = option041.querySelector("#option-text-04-1").innerText;
        sBtn_text041.innerText = selectedOption041;
        
        const data = {
            uid: $("#uid").val(),
            height: selectedOption041,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateHeight",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("직업이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu041.classList.remove("active");
    });
});

// drop down menu4 - 채형
const optionMenu042 = document.querySelector("#select-04-2"),
    selectBtn042 = optionMenu042.querySelector("#select-btn-04-2"),
    options042 = optionMenu042.querySelectorAll("#option-04-2"),
    sBtn_text042 = optionMenu042.querySelector("#sBtn-text-04-2");

selectBtn042.addEventListener("click", () => optionMenu042.classList.toggle("active"));

options042.forEach(option042 => {
    option042.addEventListener("click", () => {
        let selectedOption042 = option042.querySelector("#option-text-04-2").innerText;
        sBtn_text042.innerText = selectedOption042;
        
        const data = {
            uid: $("#uid").val(),
            body: selectedOption042,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateBody",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("직업이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu042.classList.remove("active");
    });
});

// drop down menu4 - MBTI
const optionMenu043 = document.querySelector("#select-04-3"),
    selectBtn043 = optionMenu043.querySelector("#select-btn-04-3"),
    options043 = optionMenu043.querySelectorAll("#option-04-3"),
    sBtn_text043 = optionMenu043.querySelector("#sBtn-text-04-3");

selectBtn043.addEventListener("click", () => optionMenu043.classList.toggle("active"));

options043.forEach(option043 => {
    option043.addEventListener("click", () => {
        let selectedOption043 = option043.querySelector("#option-text-04-3").innerText;
        sBtn_text043.innerText = selectedOption043;
        
        const data = {
            uid: $("#uid").val(),
            mbti: selectedOption043,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateMbti",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("직업이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu043.classList.remove("active");
    });
});

// drop down menu4 - 흡연여부
const optionMenu044 = document.querySelector("#select-04-4"),
    selectBtn044 = optionMenu044.querySelector("#select-btn-04-4"),
    options044 = optionMenu044.querySelectorAll("#option-04-4"),
    sBtn_text044 = optionMenu044.querySelector("#sBtn-text-04-4");

selectBtn044.addEventListener("click", () => optionMenu044.classList.toggle("active"));

options044.forEach(option044 => {
    option044.addEventListener("click", () => {
        let selectedOption044 = option044.querySelector("#option-text-04-4").innerText;
        sBtn_text044.innerText = selectedOption044;
        
        const data = {
            uid: $("#uid").val(),
            smoke: selectedOption044,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateSmoke",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("직업이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu044.classList.remove("active");
    });
});

// drop down menu4 - 음주여부
const optionMenu045 = document.querySelector("#select-04-5"),
    selectBtn045 = optionMenu045.querySelector("#select-btn-04-5"),
    options045 = optionMenu045.querySelectorAll("#option-04-5"),
    sBtn_text045 = optionMenu045.querySelector("#sBtn-text-04-5");

selectBtn045.addEventListener("click", () => optionMenu045.classList.toggle("active"));

options045.forEach(option045 => {
    option045.addEventListener("click", () => {
        let selectedOption045 = option045.querySelector("#option-text-04-5").innerText;
        sBtn_text045.innerText = selectedOption045;
        
        const data = {
            uid: $("#uid").val(),
            drink: selectedOption045,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateDrink",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("직업이 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu045.classList.remove("active");
    });
});

// drop down menu4 - 음주여부
const optionMenu26 = document.querySelector("#select-26"),
    selectBtn26 = optionMenu26.querySelector("#select-btn-26"),
    options26 = optionMenu26.querySelectorAll("#option-26"),
    sBtn_text26 = optionMenu26.querySelector("#sBtn-text-26");

selectBtn26.addEventListener("click", () => optionMenu26.classList.toggle("active"));

options26.forEach(option26 => {
    option26.addEventListener("click", () => {
        let selectedOption26 = option26.querySelector("#option-text-26").innerText;
        sBtn_text26.innerText = selectedOption26;
        
        const data = {
            uid: $("#uid").val(),
            token: $("#token").val(),
            companion: selectedOption26,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateCompanion",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("반려 이유가 전송되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu26.classList.remove("active");
    });
});

// drop down menu10-1 - 고급차량인증
const optionMenu10_1 = document.querySelector("#select-10-1"),
    selectBtn10_1 = optionMenu10_1.querySelector("#select-btn-10-1"),
    options10_1 = optionMenu10_1.querySelectorAll("#option-10-1"),
    sBtn_text10_1 = optionMenu10_1.querySelector("#sBtn-text-10-1");

selectBtn10_1.addEventListener("click", () => optionMenu10_1.classList.toggle("active"));

options10_1.forEach(option10_1 => {
    option10_1.addEventListener("click", () => {
        let selectedOption10_1 = option10_1.querySelector("#option-text-10-1").innerText;
        sBtn_text10_1.innerText = selectedOption10_1;
        
        const data = {
            uid: $("#uid").val(),
            ability1: selectedOption10_1,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility1",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("고급차량인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu10_1.classList.remove("active");
    });
});

// drop down menu11-1 - 슈퍼카인증
const optionMenu11_1 = document.querySelector("#select-11-1"),
    selectBtn11_1 = optionMenu11_1.querySelector("#select-btn-11-1"),
    options11_1 = optionMenu11_1.querySelectorAll("#option-11-1"),
    sBtn_text11_1 = optionMenu11_1.querySelector("#sBtn-text-11-1");

selectBtn11_1.addEventListener("click", () => optionMenu11_1.classList.toggle("active"));

options11_1.forEach(option11_1 => {
    option11_1.addEventListener("click", () => {
        let selectedOption11_1 = option11_1.querySelector("#option-text-11-1").innerText;
        sBtn_text11_1.innerText = selectedOption11_1;
        
        const data = {
            uid: $("#uid").val(),
            ability2: selectedOption11_1,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility2",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("슈퍼카인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu10_1.classList.remove("active");
    });
});

// drop down menu5 - 전문직인증
const optionMenu05 = document.querySelector("#select-05"),
    selectBtn05 = optionMenu05.querySelector("#select-btn-05"),
    options05 = optionMenu05.querySelectorAll("#option-05"),
    sBtn_text05 = optionMenu05.querySelector("#sBtn-text-05");

selectBtn05.addEventListener("click", () => optionMenu05.classList.toggle("active"));

options05.forEach(option05 => {
    option05.addEventListener("click", () => {
        let selectedOption05 = option05.querySelector("#option-text-05").innerText;
        sBtn_text05.innerText = selectedOption05;
        
        const data = {
            uid: $("#uid").val(),
            ability3: selectedOption05,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility3",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("전문직인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu05.classList.remove("active");
    });
});

// drop down menu5 - 대기업인증
const optionMenu12 = document.querySelector("#select-12"),
    selectBtn12 = optionMenu12.querySelector("#select-btn-12"),
    options12 = optionMenu12.querySelectorAll("#option-12"),
    sBtn_text12 = optionMenu12.querySelector("#sBtn-text-12");

selectBtn12.addEventListener("click", () => optionMenu12.classList.toggle("active"));

options12.forEach(option12 => {
    option12.addEventListener("click", () => {
        let selectedOption12 = option12.querySelector("#option-text-12").innerText;
        sBtn_text12.innerText = selectedOption12;
        
        const data = {
            uid: $("#uid").val(),
            ability4: selectedOption12,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility4",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("대기업인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu12.classList.remove("active");
    });
});

// drop down menu5 - 사업가인증(매출10억이상)
const optionMenu13 = document.querySelector("#select-13"),
    selectBtn13 = optionMenu13.querySelector("#select-btn-13"),
    options13 = optionMenu13.querySelectorAll("#option-13"),
    sBtn_text13 = optionMenu13.querySelector("#sBtn-text-13");

selectBtn13.addEventListener("click", () => optionMenu13.classList.toggle("active"));

options13.forEach(option13 => {
    option13.addEventListener("click", () => {
        let selectedOption13 = option13.querySelector("#option-text-13").innerText;
        sBtn_text13.innerText = selectedOption13;
        
        const data = {
            uid: $("#uid").val(),
            ability5: selectedOption13,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility5",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("사업가인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu13.classList.remove("active");
    });
});

// drop down menu5 - 사업가인증(매출20억이상)
const optionMenu14 = document.querySelector("#select-14"),
    selectBtn14 = optionMenu14.querySelector("#select-btn-14"),
    options14 = optionMenu14.querySelectorAll("#option-14"),
    sBtn_text14 = optionMenu14.querySelector("#sBtn-text-14");

selectBtn14.addEventListener("click", () => optionMenu14.classList.toggle("active"));

options14.forEach(option14 => {
    option14.addEventListener("click", () => {
        let selectedOption14 = option14.querySelector("#option-text-14").innerText;
        sBtn_text14.innerText = selectedOption14;
        
        const data = {
            uid: $("#uid").val(),
            ability6: selectedOption14,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility6",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("사업가인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu14.classList.remove("active");
    });
});

// drop down menu5 - 사업가인증(매출30억이상)
const optionMenu15 = document.querySelector("#select-15"),
    selectBtn15 = optionMenu15.querySelector("#select-btn-15"),
    options15 = optionMenu15.querySelectorAll("#option-15"),
    sBtn_text15 = optionMenu15.querySelector("#sBtn-text-15");

selectBtn15.addEventListener("click", () => optionMenu15.classList.toggle("active"));

options15.forEach(option15 => {
    option15.addEventListener("click", () => {
        let selectedOption15 = option15.querySelector("#option-text-15").innerText;
        sBtn_text15.innerText = selectedOption15;
        
        const data = {
            uid: $("#uid").val(),
            ability7: selectedOption15,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility7",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("사업가인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu15.classList.remove("active");
    });
});

// drop down menu3-1 - 명문대인증
const optionMenu03_1 = document.querySelector("#select-03-1"),
    selectBtn03_1 = optionMenu03_1.querySelector("#select-btn-03-1"),
    options03_1 = optionMenu03_1.querySelectorAll("#option-03-1"),
    sBtn_text03_1 = optionMenu03_1.querySelector("#sBtn-text-03-1");

selectBtn03_1.addEventListener("click", () => optionMenu03_1.classList.toggle("active"));

options03_1.forEach(option03_1 => {
    option03_1.addEventListener("click", () => {
        let selectedOption03_1 = option03_1.querySelector("#option-text-03-1").innerText;
        sBtn_text03_1.innerText = selectedOption03_1;
        
        const data = {
            uid: $("#uid").val(),
            ability8: selectedOption03_1,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility8",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("명문대인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu03_1.classList.remove("active");
    });
});

// drop down menu5 - 고액소득(7천만원이상)
const optionMenu16 = document.querySelector("#select-16"),
    selectBtn16 = optionMenu16.querySelector("#select-btn-16"),
    options16 = optionMenu16.querySelectorAll("#option-16"),
    sBtn_text16 = optionMenu16.querySelector("#sBtn-text-16");

selectBtn16.addEventListener("click", () => optionMenu16.classList.toggle("active"));

options16.forEach(option16 => {
    option16.addEventListener("click", () => {
        let selectedOption16 = option16.querySelector("#option-text-16").innerText;
        sBtn_text16.innerText = selectedOption16;
        
        const data = {
            uid: $("#uid").val(),
            ability9: selectedOption16,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility9",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("고액소득인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu16.classList.remove("active");
    });
});

// drop down menu5 - 억대소득(1억이상)
const optionMenu17 = document.querySelector("#select-17"),
    selectBtn17 = optionMenu17.querySelector("#select-btn-17"),
    options17 = optionMenu17.querySelectorAll("#option-17"),
    sBtn_text17 = optionMenu17.querySelector("#sBtn-text-17");

selectBtn17.addEventListener("click", () => optionMenu17.classList.toggle("active"));

options17.forEach(option17 => {
    option17.addEventListener("click", () => {
        let selectedOption17 = option17.querySelector("#option-text-17").innerText;
        sBtn_text17.innerText = selectedOption17;
        
        const data = {
            uid: $("#uid").val(),
            ability10: selectedOption17,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility10",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("억대소득인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu17.classList.remove("active");
    });
});

// drop down menu5 - 고액자산(5억이상)
const optionMenu18 = document.querySelector("#select-18"),
    selectBtn18 = optionMenu18.querySelector("#select-btn-18"),
    options18 = optionMenu18.querySelectorAll("#option-18"),
    sBtn_text18 = optionMenu18.querySelector("#sBtn-text-18");

selectBtn18.addEventListener("click", () => optionMenu18.classList.toggle("active"));

options18.forEach(option18 => {
    option18.addEventListener("click", () => {
        let selectedOption18 = option18.querySelector("#option-text-18").innerText;
        sBtn_text18.innerText = selectedOption18;
        
        const data = {
            uid: $("#uid").val(),
            ability11: selectedOption18,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility11",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("고액자산인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu18.classList.remove("active");
    });
});

// drop down menu5 - 고액자산(10억이상)
const optionMenu19 = document.querySelector("#select-19"),
    selectBtn19 = optionMenu19.querySelector("#select-btn-19"),
    options19 = optionMenu19.querySelectorAll("#option-19"),
    sBtn_text19 = optionMenu19.querySelector("#sBtn-text-19");

selectBtn19.addEventListener("click", () => optionMenu19.classList.toggle("active"));

options19.forEach(option19 => {
    option19.addEventListener("click", () => {
        let selectedOption19 = option19.querySelector("#option-text-19").innerText;
        sBtn_text19.innerText = selectedOption19;
        
        const data = {
            uid: $("#uid").val(),
            ability12: selectedOption19,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility12",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("고액자산인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu19.classList.remove("active");
    });
});

// drop down menu5 - 초고액자산(20억이상)
const optionMenu20 = document.querySelector("#select-20"),
    selectBtn20 = optionMenu20.querySelector("#select-btn-20"),
    options20 = optionMenu20.querySelectorAll("#option-20"),
    sBtn_text20 = optionMenu20.querySelector("#sBtn-text-20");

selectBtn20.addEventListener("click", () => optionMenu20.classList.toggle("active"));

options20.forEach(option20 => {
    option20.addEventListener("click", () => {
        let selectedOption20 = option20.querySelector("#option-text-20").innerText;
        sBtn_text20.innerText = selectedOption20;
        
        const data = {
            uid: $("#uid").val(),
            ability13: selectedOption20,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility13",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("초고액자산인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu20.classList.remove("active");
    });
});

// drop down menu5 - 고가아파트(10억이상)
const optionMenu21 = document.querySelector("#select-21"),
    selectBtn21 = optionMenu21.querySelector("#select-btn-21"),
    options21 = optionMenu21.querySelectorAll("#option-21"),
    sBtn_text21 = optionMenu21.querySelector("#sBtn-text-21");

selectBtn21.addEventListener("click", () => optionMenu21.classList.toggle("active"));

options21.forEach(option21 => {
    option21.addEventListener("click", () => {
        let selectedOption21 = option21.querySelector("#option-text-21").innerText;
        sBtn_text21.innerText = selectedOption21;
        
        const data = {
            uid: $("#uid").val(),
            ability14: selectedOption21,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility14",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("고가아파트인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu21.classList.remove("active");
    });
});

// drop down menu5 - 초고가아파트(20억이상)
const optionMenu22 = document.querySelector("#select-22"),
    selectBtn22 = optionMenu22.querySelector("#select-btn-22"),
    options22 = optionMenu22.querySelectorAll("#option-22"),
    sBtn_text22 = optionMenu22.querySelector("#sBtn-text-22");

selectBtn22.addEventListener("click", () => optionMenu22.classList.toggle("active"));

options22.forEach(option22 => {
    option22.addEventListener("click", () => {
        let selectedOption22 = option22.querySelector("#option-text-22").innerText;
        sBtn_text22.innerText = selectedOption22;
        
        const data = {
            uid: $("#uid").val(),
            ability15: selectedOption22,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility15",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("초고가아파트인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu22.classList.remove("active");
    });
});

// drop down menu5 - 집안자산(30억이상)
const optionMenu23 = document.querySelector("#select-23"),
    selectBtn23 = optionMenu23.querySelector("#select-btn-23"),
    options23 = optionMenu23.querySelectorAll("#option-23"),
    sBtn_text23 = optionMenu23.querySelector("#sBtn-text-23");

selectBtn23.addEventListener("click", () => optionMenu23.classList.toggle("active"));

options23.forEach(option23 => {
    option23.addEventListener("click", () => {
        let selectedOption23 = option23.querySelector("#option-text-23").innerText;
        sBtn_text23.innerText = selectedOption23;
        
        const data = {
            uid: $("#uid").val(),
            ability16: selectedOption23,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility16",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("집안자산인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu23.classList.remove("active");
    });
});

// drop down menu5 - 집안자산(50억이상)
const optionMenu24 = document.querySelector("#select-24"),
    selectBtn24 = optionMenu24.querySelector("#select-btn-24"),
    options24 = optionMenu24.querySelectorAll("#option-24"),
    sBtn_text24 = optionMenu24.querySelector("#sBtn-text-24");

selectBtn24.addEventListener("click", () => optionMenu24.classList.toggle("active"));

options24.forEach(option24 => {
    option24.addEventListener("click", () => {
        let selectedOption24 = option24.querySelector("#option-text-24").innerText;
        sBtn_text24.innerText = selectedOption24;
        
        const data = {
            uid: $("#uid").val(),
            ability17: selectedOption24,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility17",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("집안자산인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu24.classList.remove("active");
    });
});

// drop down menu5 - 명문가
const optionMenu25 = document.querySelector("#select-25"),
    selectBtn25 = optionMenu25.querySelector("#select-btn-25"),
    options25 = optionMenu25.querySelectorAll("#option-25"),
    sBtn_text25 = optionMenu25.querySelector("#sBtn-text-25");

selectBtn25.addEventListener("click", () => optionMenu25.classList.toggle("active"));

options25.forEach(option25 => {
    option25.addEventListener("click", () => {
        let selectedOption25 = option25.querySelector("#option-text-25").innerText;
        sBtn_text25.innerText = selectedOption25;
        
        const data = {
            uid: $("#uid").val(),
            ability18: selectedOption25,
        }
        
        $.ajax({
            type: "POST",
            url: "/api/updateAbility18",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function(resp) {
            alert("명문가인증 변경이 완료되었습니다.");
        }).fail(function (err) {
            alert(JSON.stringify(err));
        });

        optionMenu25.classList.remove("active");
    });
});

//보석개수변경
const btnIng = document.querySelector('.btn-plus');
btnIng.addEventListener('click', () => {
    console.log('보석갯수 변경 누름');
    
    const data = {
        token: $("#token").val(),
        uid: $("#uid").val(),
        num: $("#dia").val()
    }
    
    $.ajax({
        type: "POST",
        url: "/api/updateDia",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(resp) {
        alert("보석갯수 수정이 완료 되었습니다.");
    }).fail(function (err) {
        alert(JSON.stringify(err));
    });
});

//반려
const btnReturn = document.querySelector('.btn-return');
btnReturn.addEventListener('click', () => {
    console.log('반려버튼 누름');
    
    const data = {
        token: $("#token").val(),
        uid: $("#uid").val(),
        reason: "썸푸닝 프로필 심사중 반려중으로 분류되었습니다.",
    }
    
    $.ajax({
        type: "POST",
        url: "/api/updateReturn",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(resp) {
        alert("프로필 심사 반려를 전송하였습니다.");
    }).fail(function (err) {
        alert(JSON.stringify(err));
    });
});

//승인
const btnOk = document.querySelector('.btn-ok');
btnOk.addEventListener('click', () => {
    console.log('승인버튼 누름');
    
    const data = {
        token: $("#token").val(),
        uid: $("#uid").val(),
        reason: "썸푸닝 프로필 심사 승인 되었습니다.",
    }
    
    $.ajax({
        type: "POST",
        url: "/api/updateOk",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(resp) {
        alert("프로필 심사 승인을 전송하였습니다.");
    }).fail(function (err) {
        alert(JSON.stringify(err));
    });
});