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
        if(document.getElementById("admin-dashboard-view")) document.getElementById("admin-dashboard-view").style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    // 업체별 명단 그리기 함수 복구
    function renderAdminList() {
        var listCont = document.getElementById("admin-list-content");
        if(listCont && typeof VIP_LIST !== "undefined") {
            var html = "<table style='width:100%; color:white; border-collapse:collapse;'>";
            html += "<tr style='border-bottom:1px solid #555;'><th style='padding:10px;'>캠프</th><th style='padding:10px;'>성명(ID)</th></tr>";
            VIP_LIST.forEach(function(id) {
                html += "<tr style='border-bottom:1px solid #333;'><td style='padding:8px; text-align:center;'>천안1</td><td style='padding:8px; text-align:center;'>" + id + "</td></tr>";
            });
            html += "</table>";
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

        if (uid.trim().toLowerCase() === "ryanl82") {
            document.getElementById("main-view").style.display = "none";
            var adminDash = document.getElementById("admin-dashboard-view");
            if (adminDash) {
                adminDash.style.display = "block";
                renderAdminList(); // 명단 소환

                var existingBtn = document.getElementById("adminBtn");
                if (existingBtn) existingBtn.parentNode.removeChild(existingBtn);

                var btn = document.createElement("button");
                btn.id = "adminBtn";
                btn.innerHTML = "👑 기사님 승인 리모컨 👑";
                btn.className = "btn-submit";
                btn.style = "margin-top:20px; background:#ff8c00; color:#fff; font-weight:900;";
                
                btn.onclick = function() {
                    var newId = prompt("승인할 아이디 입력:");
                    if (newId) {
                        fetch(DB_URL + "users/" + newId.trim() + ".json", {
                            method: "PUT", body: JSON.stringify(true)
                        }).then(function() { alert(newId + " 승인 완료!"); });
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
            // 주소 안 뜨는 예쁜 팝업을 위해 alert 대신 custom 처리 가능하지만 일단 기본 alert 유지
            alert("아이디와 소속 캠프를 입력해주세요.");
            return;
        }
        var cleanId = a.trim();
        
        // 🔥 관리자 ryanl82 비번 보안 복구
        if (cleanId.toLowerCase() === "ryanl82") {
            var pw = prompt("🔐 관리자 비밀번호를 입력하세요:");
            if(pw === "0000") { // 👈 기사님 원래 비번으로 수정하세요!
                window.loginSuccess(cleanId, b);
            } else {
                alert("비밀번호가 틀렸습니다.");
            }
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

    // 새로고침 방어
    window.onload = function() {
        setTimeout(function() {
            var u = localStorage.getItem("rl_uid"), c = localStorage.getItem("rl_ucamp");
            if (u && c) {
                // 관리자로 이미 로그인된 상태면 비번 다시 안 묻고 통과 (새로고침 시에만)
                window.loginSuccess(u, c);
            }
        }, 150);
    };
})();
