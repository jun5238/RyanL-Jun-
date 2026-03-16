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
        var adminDash = document.getElementById("admin-dashboard-view");
        if(adminDash) adminDash.style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    window.loginSuccess = function(uid, camp) {
        localStorage.setItem("rl_uid", uid);
        localStorage.setItem("rl_ucamp", camp);
        
        document.getElementById("form-id").value = uid;
        document.getElementById("form-camp").value = camp;
        document.getElementById("display-id").innerText = uid;
        document.getElementById("display-camp").innerText = camp;
        
        document.getElementById("setup-view").style.display = "none";

        var cleanUid = uid.trim().toLowerCase();

        // 👑 관리자(ryanl82)는 무조건 '기사 명단 대시보드'로!
        if (cleanUid === "ryanl82") {
            document.getElementById("main-view").style.display = "none";
            var adminDash = document.getElementById("admin-dashboard-view");
            if (adminDash) {
                adminDash.style.display = "block";

                // 리모컨 생성 (중복 방지)
                var existingBtn = document.getElementById("adminBtn");
                if (existingBtn) existingBtn.parentNode.removeChild(existingBtn);

                var btn = document.createElement("button");
                btn.id = "adminBtn";
                btn.innerHTML = "👑 기사님 승인 리모컨 👑";
                btn.className = "btn-submit"; // 기존 디자인 스타일 적용
                btn.style = "margin-top:20px; background:#ff8c00; color:#fff; font-weight:900;";
                
                btn.onclick = function() {
                    var newId = prompt("승인할 아이디 입력:");
                    if (newId) {
                        fetch(DB_URL + "users/" + newId.trim() + ".json", {
                            method: "PUT", body: JSON.stringify(true)
                        }).then(function() {
                            // 촌스러운 alert 대신 간단한 텍스트 알림이나 기사님 명단 갱신 로직 활용 가능
                            alert(newId + " 승인 완료!"); 
                        });
                    }
                };
                
                var closeBtn = adminDash.querySelector("button[onclick='closeAdmin()']");
                adminDash.insertBefore(btn, closeBtn);
            }
        } else {
            document.getElementById("main-view").style.display = "block";
        }
    };

    window.processLogin = function(a, b) {
        if (!a || !b) {
            // 아이디 미입력 시에도 예쁜 팝업을 활용하거나 기존 경고 유지
            alert("아이디와 소속 캠프를 입력해주세요.");
            return;
        }
        var cleanId = a.trim();
        if (cleanId.toLowerCase() === "ryanl82") {
            window.loginSuccess(cleanId, b);
        } else {
            fetch(DB_URL + "users/" + cleanId + ".json")
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data === true || (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId))) {
                    window.loginSuccess(cleanId, b);
                } else {
                    // 🚨 상단 주소 뜨는 alert 대신 기사님이 만든 예쁜 빨간 팝업 소환!
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

    window.submitForm = function() {
        var uid = localStorage.getItem("rl_uid"), camp = localStorage.getItem("rl_ucamp");
        logToFirebase({
            user: uid, camp: camp, waybill: document.getElementById("waybill").value,
            quantity: document.getElementById("quantity").value, time: new Date().toLocaleString()
        });
        alert("제출 완료!");
        document.getElementById("waybill").value = "";
        document.getElementById("quantity").value = "";
    };

    window.onload = function() {
        setTimeout(function() {
            var u = localStorage.getItem("rl_uid"), c = localStorage.getItem("rl_ucamp");
            if (u && c) window.processLogin(u, c);
        }, 150);
    };
})();
