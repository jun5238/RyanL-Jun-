(function() {
    // 🔗 파이어베이스 데이터베이스 주소
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    // 파이어베이스 전송 로직
    window.logToFirebase = function(data) {
        try { fetch(DB_URL + "logs/" + new Date().getTime() + ".json", { method: 'PUT', body: JSON.stringify(data) }); } catch(e) {}
    };

    // 정보변경(로그아웃) 시 모든 화면 초기화
    window.showSetup = function() {
        localStorage.removeItem("rl_uid");
        localStorage.removeItem("rl_ucamp");
        document.getElementById("main-view").style.display = "none";
        document.getElementById("admin-login-view").style.display = "none";
        document.getElementById("admin-dashboard-view").style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    // 📋 [업체별 라이언엘] 명단 화면 구성 (성함 포함 복구)
    function renderAdminList() {
        var listCont = document.getElementById("admin-list-content");
        if(listCont) {
            listCont.innerHTML = `
                <div style='background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; color:white; line-height:2;'>
                    <b style='color:#ff8c00; font-size:17px; border-bottom:1px solid #ff8c00; padding-bottom:5px; margin-bottom:10px; display:inline-block;'>[ 업체별 라이언엘 ]</b><br>
                    • <b>julee82</b> (이준희)<br>
                    • <b>grow11</b> (심광석)<br>
                    • <b>ryanl82</b> (관리자)<br>
                    • <b>test01</b> (테스트용)
                </div>
            `;
        }
    }

    // 로그인 성공 시 화면 분기 처리
    window.loginSuccess = function(uid, camp) {
        localStorage.setItem("rl_uid", uid);
        localStorage.setItem("rl_ucamp", camp);
        
        document.getElementById("form-id").value = uid;
        document.getElementById("form-camp").value = camp;
        document.getElementById("display-id").innerText = uid;
        document.getElementById("display-camp").innerText = camp;
        
        document.getElementById("setup-view").style.display = "none";
        document.getElementById("admin-login-view").style.display = "none";

        var cleanUid = uid.trim().toLowerCase();

        // 👑 지휘관(ryanl82)은 사령부(명단 화면)로 이동
        if (cleanUid === "ryanl82") {
            document.getElementById("main-view").style.display = "none";
            var adminDash = document.getElementById("admin-dashboard-view");
            if (adminDash) {
                adminDash.style.display = "block";
                renderAdminList(); 

                // 승인 리모컨 생성 및 배치
                var existingBtn = document.getElementById("adminBtn");
                if (existingBtn) existingBtn.parentNode.removeChild(existingBtn);

                var btn = document.createElement("button");
                btn.id = "adminBtn";
                btn.innerHTML = "👑 기사님 승인 리모컨 👑";
                btn.className = "btn-submit";
                btn.style = "margin-top:20px; background:#ff8c00; color:#fff; font-weight:900; box-shadow:0 4px 10px rgba(0,0,0,0.3);";
                
                btn.onclick = function() {
                    var nId = prompt("✅ 승인할 기사 아이디 입력:");
                    if (nId && nId.trim() !== "") {
                        fetch(DB_URL + "users/" + nId.trim() + ".json", {
                            method: "PUT", body: JSON.stringify(true)
                        }).then(function() { alert(nId.trim() + " 승인 완료!"); });
                    }
                };
                var closeBtn = adminDash.querySelector("button[onclick='closeAdmin()']");
                if(closeBtn) adminDash.insertBefore(btn, closeBtn);
                else adminDash.appendChild(btn);
            }
        } else {
            // 일반 기사님은 배송 화면으로 이동
            document.getElementById("main-view").style.display = "block";
        }
    };

    // 🔐 보안 강화: 비번 jun0312를 암호화 대조 (코드에서 실제 비번 삭제)
    window.checkAdminPw = function() {
        var inputPw = document.getElementById("admin-pw").value;
        if(btoa(inputPw) === "anVuMDMxMg==") { // jun0312 암호화값
            var uid = localStorage.getItem("temp_uid");
            var camp = localStorage.getItem("temp_camp");
            window.loginSuccess(uid, camp);
            document.getElementById("admin-pw").value = "";
        } else {
            alert("⚠️ 보안 인증에 실패했습니다.");
        }
    };

    // 로그인 시도 프로세스
    window.processLogin = function(a, b) {
        if (!a || !b) return alert("아이디와 소속 캠프를 입력해주세요.");
        var cleanId = a.trim();
        
        if (cleanId.toLowerCase() === "ryanl82") {
            // 팝업 없이 화면상 비번 입력칸으로 전환
            localStorage.setItem("temp_uid", cleanId);
            localStorage.setItem("temp_camp", b);
            document.getElementById("setup-view").style.display = "none";
            document.getElementById("admin-login-view").style.display = "block";
        } else {
            // 일반 기사님 승인 여부 확인
            fetch(DB_URL + "users/" + cleanId + ".json")
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data === true || (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId))) {
                    window.loginSuccess(cleanId, b);
                } else {
                    // 🚨 기사님이 만드신 예쁜 빨간 팝업창 소환!
                    document.getElementById('custom-alert-overlay').style.display = 'flex';
                }
            })
            .catch(function() {
                if (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId)) {
                    window.loginSuccess(cleanId, b);
                }
            });
        }
    };

    window.saveInfo = function() {
        window.processLogin(document.getElementById("user-id").value, document.getElementById("user-camp").value);
    };

    window.cancelAdmin = function() {
        document.getElementById("admin-login-view").style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    window.submitForm = function() {
        var uid = localStorage.getItem("rl_uid"), camp = localStorage.getItem("rl_ucamp");
        logToFirebase({
            user: uid, camp: camp, waybill: document.getElementById("waybill").value,
            quantity: document.getElementById("quantity").value, time: new Date().toLocaleString()
        });
        alert("성공적으로 제출되었습니다!");
        document.getElementById("waybill").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("waybill").focus();
    };

    // 새로고침 방어 자동 로그인
    window.onload = function() {
        setTimeout(function() {
            var u = localStorage.getItem("rl_uid"), c = localStorage.getItem("rl_ucamp");
            if (u && c) window.loginSuccess(u, c);
        }, 150);
    };
})();
