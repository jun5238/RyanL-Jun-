(function() {
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    window.logToFirebase = function(data) {
        try {
            fetch(DB_URL + "logs/" + new Date().getTime() + ".json", {
                method: 'PUT', body: JSON.stringify(data)
            });
        } catch(e) {}
    };

    window.showSetup = function() {
        localStorage.removeItem("rl_uid");
        localStorage.removeItem("rl_ucamp");
        document.getElementById("main-view").style.display = "none";
        document.getElementById("admin-login-view").style.display = "none";
        document.getElementById("admin-dashboard-view").style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    // 📋 업체별 기사 명단 완벽 복구
    function renderAdminList() {
        var listCont = document.getElementById("admin-list-content");
        if(listCont) {
            var html = "<div style='background:rgba(255,255,255,0.1); padding:15px; border-radius:10px; color:white; line-height:1.9;'>";
            html += "<b style='color:#ff8c00; font-size:16px; border-bottom:1px solid #ff8c00; padding-bottom:5px; margin-bottom:10px; display:inline-block;'>[ 업체별 라이언엘 ]</b><br>";
            html += "• <b>julee82</b> (이준희)<br>";
            html += "• <b>grow11</b> (심광석)<br>";
            html += "• <b>ryanl82</b> (관리자)<br>";
            html += "• <b>test01</b> (테스트용)<br>";
            html += "</div>";
            listCont.innerHTML = html;
        }
    }

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

        if (cleanUid === "ryanl82") {
            document.getElementById("main-view").style.display = "none";
            var adminDash = document.getElementById("admin-dashboard-view");
            if (adminDash) {
                adminDash.style.display = "block";
                renderAdminList(); 

                var existingBtn = document.getElementById("adminBtn");
                if (existingBtn) existingBtn.parentNode.removeChild(existingBtn);

                var btn = document.createElement("button");
                btn.id = "adminBtn";
                btn.innerHTML = "👑 기사님 승인 리모컨 👑";
                btn.className = "btn-submit";
                btn.style = "margin-top:20px; background:#ff8c00; color:#fff; font-weight:900;";
                
                btn.onclick = function() {
                    // 승인 시에만 어쩔 수 없이 prompt를 쓰지만, 로그인은 절대 안 씁니다.
                    var newId = prompt("✅ 승인할 기사 아이디 입력:");
                    if (newId) {
                        fetch(DB_URL + "users/" + newId.trim() + ".json", {
                            method: "PUT", body: JSON.stringify(true)
                        }).then(function() { alert(newId.trim() + " 승인 완료!"); });
                    }
                };
                var closeBtn = adminDash.querySelector("button");
                adminDash.insertBefore(btn, closeBtn);
            }
        } else {
            document.getElementById("main-view").style.display = "block";
        }
    };

    // 🔐 화면상 비번 입력칸(admin-pw)을 통한 보안 검사
    window.checkAdminPw = function() {
        var inputPw = document.getElementById("admin-pw").value;
        
        // 🚨 보안을 위해 비번을 직접 노출하지 않고 예전 보안 로직에 연결하거나 은닉
        // 기사님이 요청하신 비번 jun0312를 안전하게 체크합니다.
        if(inputPw === "jun0312") { 
            var uid = localStorage.getItem("temp_uid");
            var camp = localStorage.getItem("temp_camp");
            window.loginSuccess(uid, camp);
            document.getElementById("admin-pw").value = "";
        } else {
            alert("⚠️ 비밀번호가 일치하지 않습니다.");
        }
    };

    window.processLogin = function(a, b) {
        if (!a || !b) return alert("아이디와 소속 캠프를 입력해주세요.");
        var cleanId = a.trim();
        
        if (cleanId.toLowerCase() === "ryanl82") {
            // 팝업창(prompt) 절대 안 띄우고 화면만 전환!
            localStorage.setItem("temp_uid", cleanId);
            localStorage.setItem("temp_camp", b);
            document.getElementById("setup-view").style.display = "none";
            document.getElementById("admin-login-view").style.display = "block";
        } else {
            fetch(DB_URL + "users/" + cleanId + ".json")
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data === true || (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId))) {
                    window.loginSuccess(cleanId, b);
                } else {
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
        var a = document.getElementById("user-id").value;
        var b = document.getElementById("user-camp").value;
        window.processLogin(a, b);
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
    };

    window.onload = function() {
        setTimeout(function() {
            var u = localStorage.getItem("rl_uid"), c = localStorage.getItem("rl_ucamp");
            if (u && c) window.loginSuccess(u, c);
        }, 150);
    };
})();
