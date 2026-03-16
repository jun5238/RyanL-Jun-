(function() {
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    window.logToFirebase = function(data) {
        try { fetch(DB_URL + "logs/" + new Date().getTime() + ".json", { method: 'PUT', body: JSON.stringify(data) }); } catch(e) {}
    };

    window.showSetup = function() {
        localStorage.removeItem("rl_uid");
        localStorage.removeItem("rl_ucamp");
        document.getElementById("main-view").style.display = "none";
        document.getElementById("admin-login-view").style.display = "none";
        document.getElementById("admin-dashboard-view").style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    function renderAdminList() {
        var listCont = document.getElementById("admin-list-content");
        if(listCont) {
            listCont.innerHTML = `
                <div style='background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; color:white; line-height:2.2;'>
                    <b style='color:#ff8c00; font-size:17px; border-bottom:1px solid #ff8c00; padding-bottom:5px; margin-bottom:12px; display:inline-block;'>[ 업체별 라이언엘 ]</b><br>
                    • <b>julee82</b> (이준희)<br>
                    • <b>grow11</b> (심광석)<br>
                    • <b>ryanl82</b> (관리자)<br>
                    • <b>test01</b> (테스트용)
                </div>
                <button id="adminBtn" class="btn-submit" style="margin-top:20px; background:#ff8c00; color:#fff; font-weight:900; width:100%; padding:15px; border:none; border-radius:8px; cursor:pointer;">👑 기사님 승인 리모컨 👑</button>
            `;
            
            var btn = document.getElementById("adminBtn");
            if(btn) {
                btn.onclick = function() {
                    var nId = prompt("ID 입력:");
                    if (nId && nId.trim() !== "") {
                        fetch(DB_URL + "users/" + nId.trim() + ".json", {
                            method: "PUT", body: JSON.stringify(true)
                        }).then(function() { alert("완료"); });
                    }
                };
            }
        }
    }

    window.loginSuccess = function(uid, camp) {
        localStorage.setItem("rl_uid", uid);
        localStorage.setItem("rl_ucamp", camp);
        document.getElementById("display-id").innerText = uid;
        document.getElementById("display-camp").innerText = camp;
        document.getElementById("form-id").value = uid;
        document.getElementById("form-camp").value = camp;
        
        document.getElementById("setup-view").style.display = "none";
        document.getElementById("admin-login-view").style.display = "none";

        if (uid.trim().toLowerCase() === "ryanl82") {
            document.getElementById("main-view").style.display = "none";
            document.getElementById("admin-dashboard-view").style.display = "block";
            renderAdminList(); 
        } else {
            document.getElementById("main-view").style.display = "block";
            document.getElementById("admin-dashboard-view").style.display = "none";
        }
    };

    window.checkAdminPw = function() {
        var input = document.getElementById("admin-pw").value;
        if(btoa(input) === "anVuMDMxMg==") { 
            window.loginSuccess(localStorage.getItem("temp_uid"), localStorage.getItem("temp_camp"));
            document.getElementById("admin-pw").value = "";
        } else {
            alert("인증 실패");
        }
    };

    window.processLogin = function(a, b) {
        if (!a || !b) return;
        var cleanId = a.trim();
        if (cleanId.toLowerCase() === "ryanl82") {
            localStorage.setItem("temp_uid", cleanId);
            localStorage.setItem("temp_camp", b);
            document.getElementById("setup-view").style.display = "none";
            document.getElementById("admin-login-view").style.display = "block";
        } else {
            fetch(DB_URL + "users/" + cleanId + ".json").then(res => res.json()).then(data => {
                if (data === true || (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId))) {
                    window.loginSuccess(cleanId, b);
                } else {
                    document.getElementById('custom-alert-overlay').style.display = 'flex';
                }
            }).catch(() => {
                if (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId)) window.loginSuccess(cleanId, b);
            });
        }
    };

    window.saveInfo = function() { window.processLogin(document.getElementById("user-id").value, document.getElementById("user-camp").value); };
    window.cancelAdmin = function() { document.getElementById("admin-login-view").style.display = "none"; document.getElementById("setup-view").style.display = "block"; };
    
    window.submitForm = function() {
        var uid = localStorage.getItem("rl_uid"), camp = localStorage.getItem("rl_ucamp");
        logToFirebase({ user: uid, camp: camp, waybill: document.getElementById("waybill").value, quantity: document.getElementById("quantity").value, time: new Date().toLocaleString() });
        alert("전송 완료");
        document.getElementById("waybill").value = ""; document.getElementById("quantity").value = "";
    };

    window.addEventListener('load', function() {
        var u = localStorage.getItem("rl_uid"), c = localStorage.getItem("rl_ucamp");
        if (u && c) {
            window.loginSuccess(u, c);
        }
    });
})();
