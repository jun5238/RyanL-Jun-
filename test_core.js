(function() {
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    window.logToFirebase = function(data) {
        try { fetch(DB_URL + "logs/" + new Date().getTime() + ".json", { method: 'PUT', body: JSON.stringify(data) }); } catch(e) {}
    };

    window.showAlert = function(msg) {
        var ex = document.getElementById("rl-alert");
        if(ex) ex.remove();
        var over = document.createElement("div");
        over.id = "rl-alert";
        over.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;";
        var box = document.createElement("div");
        box.style.cssText = "background:#fff;width:80%;max-width:300px;border-radius:15px;overflow:hidden;box-shadow:0 10px 20px rgba(0,0,0,0.2);text-align:center;animation:popIn 0.3s ease-out;";
        box.innerHTML = "<div style='background:#ff3b30;color:#fff;padding:15px;font-weight:bold;font-size:18px;'>🚨 알림</div><div style='padding:25px 20px;font-size:16px;color:#333;font-weight:bold;'>" + msg + "</div><div style='padding:0 20px 20px;'><button onclick='document.getElementById(\"rl-alert\").remove()' style='width:100%;padding:12px;background:#1c2541;color:#fff;border:none;border-radius:8px;font-weight:bold;font-size:16px;'>확인</button></div>";
        var st = document.createElement("style");
        st.innerHTML = "@keyframes popIn{0%{transform:scale(0.8);opacity:0;}100%{transform:scale(1);opacity:1;}}";
        document.head.appendChild(st);
        over.appendChild(box);
        document.body.appendChild(over);
    };

    window.showPrompt = function(msg, cb) {
        var ex = document.getElementById("rl-prompt");
        if(ex) ex.remove();
        var over = document.createElement("div");
        over.id = "rl-prompt";
        over.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999;";
        var box = document.createElement("div");
        box.style.cssText = "background:#fff;width:80%;max-width:300px;border-radius:15px;overflow:hidden;box-shadow:0 10px 20px rgba(0,0,0,0.2);text-align:center;animation:popIn 0.3s ease-out;";
        var html = "<div style='background:#ff8c00;color:#fff;padding:15px;font-weight:bold;font-size:18px;'>👑 리모컨</div>";
        html += "<div style='padding:20px;'><div style='margin-bottom:10px;font-weight:bold;'>" + msg + "</div><input type='text' id='rl-p-input' style='width:100%;padding:10px;border:2px solid #ddd;border-radius:8px;font-size:16px;box-sizing:border-box;'></div>";
        html += "<div style='padding:0 20px 20px;display:flex;gap:10px;'><button onclick='document.getElementById(\"rl-prompt\").remove()' style='flex:1;padding:12px;background:#aaa;color:#fff;border:none;border-radius:8px;font-weight:bold;'>취소</button><button id='rl-p-ok' style='flex:1;padding:12px;background:#1c2541;color:#fff;border:none;border-radius:8px;font-weight:bold;'>확인</button></div>";
        box.innerHTML = html;
        over.appendChild(box);
        document.body.appendChild(over);
        document.getElementById("rl-p-ok").onclick = function() {
            var v = document.getElementById("rl-p-input").value;
            over.remove();
            if(v && v.trim() !== "") cb(v.trim());
        };
        setTimeout(function(){ document.getElementById("rl-p-input").focus(); }, 100);
    };

    window.showSetup = function() {
        localStorage.removeItem("rl_uid");
        localStorage.removeItem("rl_ucamp");
        location.href = location.href.split('?')[0];
    };

    function renderAdminList() {
        var listCont = document.getElementById("admin-list-content");
        if(listCont) {
            listCont.innerHTML = "<div style='background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; color:white; line-height:2.2;'><b style='color:#ff8c00; font-size:17px; border-bottom:1px solid #ff8c00; padding-bottom:5px; margin-bottom:12px; display:inline-block;'>[ 업체별 라이언엘 ]</b><br>• <b>julee82</b> (이준희)<br>• <b>grow11</b> (심광석)<br>• <b>ryanl82</b> (관리자)<br>• <b>test01</b> (테스트용)</div>";
        }
        var dash = document.getElementById("admin-dashboard-view");
        if(dash && !document.getElementById("adminBtn")) {
            var btn = document.createElement("button");
            btn.id = "adminBtn";
            btn.className = "btn-submit";
            btn.style.cssText = "margin-top:20px; margin-bottom:20px; background:#ff8c00; color:#fff; font-weight:900; width:100%; padding:18px; border:none; border-radius:10px; cursor:pointer; display:block;";
            btn.innerHTML = "👑 기사님 승인 리모컨 👑";
            btn.onclick = function() {
                window.showPrompt("승인할 ID 입력:", function(nId) {
                    fetch(DB_URL + "users/" + nId + ".json", {
                        method: "PUT", body: JSON.stringify(true)
                    }).then(function() { window.showAlert("승인 완료"); });
                });
            };
            var closeBtn = dash.querySelector("button[onclick='closeAdmin()']");
            if(closeBtn) {
                dash.insertBefore(btn, closeBtn);
            } else {
                dash.appendChild(btn);
            }
        }
    }

    window.loginSuccess = function(uid, camp) {
        localStorage.setItem("rl_uid", uid);
        localStorage.setItem("rl_ucamp", camp);
        var dId = document.getElementById("display-id");
        var dCamp = document.getElementById("display-camp");
        var fId = document.getElementById("form-id");
        var fCamp = document.getElementById("form-camp");
        if(dId) dId.innerText = uid;
        if(dCamp) dCamp.innerText = camp;
        if(fId) fId.value = uid;
        if(fCamp) fCamp.value = camp;
        
        var sView = document.getElementById("setup-view");
        var aLogin = document.getElementById("admin-login-view");
        if(sView) sView.style.display = "none";
        if(aLogin) aLogin.style.display = "none";

        var splash = document.getElementById("splash-screen");
        if(splash) splash.style.display = "none";

        if (uid.trim().toLowerCase() === "ryanl82") {
            var mView = document.getElementById("main-view");
            var aDash = document.getElementById("admin-dashboard-view");
            if(mView) mView.style.display = "none";
            if(aDash) aDash.style.display = "block";
            renderAdminList(); 
        } else {
            var mView = document.getElementById("main-view");
            var aDash = document.getElementById("admin-dashboard-view");
            if(mView) mView.style.display = "block";
            if(aDash) aDash.style.display = "none";
        }
    };

    window.checkAdminPw = function() {
        var input = document.getElementById("admin-pw").value;
        if(btoa(input) === "anVuMDMxMg==") { 
            window.loginSuccess(localStorage.getItem("temp_uid"), localStorage.getItem("temp_camp"));
            document.getElementById("admin-pw").value = "";
        } else {
            window.showAlert("인증 실패");
        }
    };

    window.processLogin = function(a, b) {
        if (!a || !b || b === "선택하세요") {
            window.showAlert("아이디와 소속 캠프를<br>입력해주세요.");
            return;
        }
        var cleanId = a.trim();
        if (cleanId.toLowerCase() === "ryanl82") {
            localStorage.setItem("temp_uid", cleanId);
            localStorage.setItem("temp_camp", b);
            var sView = document.getElementById("setup-view");
            var aLogin = document.getElementById("admin-login-view");
            if(sView) sView.style.display = "none";
            if(aLogin) aLogin.style.display = "block";
        } else {
            fetch(DB_URL + "users/" + cleanId + ".json").then(function(res) { return res.json(); }).then(function(data) {
                if (data === true || (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId))) {
                    window.loginSuccess(cleanId, b);
                } else {
                    var overlay = document.getElementById('custom-alert-overlay');
                    if(overlay) overlay.style.display = 'flex';
                }
            }).catch(function() {
                if (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId)) window.loginSuccess(cleanId, b);
            });
        }
    };

    window.saveInfo = function() { 
        var uId = document.getElementById("user-id");
        var uCamp = document.getElementById("user-camp");
        if(uId && uCamp) window.processLogin(uId.value, uCamp.value); 
    };
    
    window.cancelAdmin = function() { location.reload(); };
    
    window.submitForm = function() {
        var uid = localStorage.getItem("rl_uid"), camp = localStorage.getItem("rl_ucamp");
        var wBill = document.getElementById("waybill"), qty = document.getElementById("quantity");
        if(wBill && qty) {
            logToFirebase({ user: uid, camp: camp, waybill: wBill.value, quantity: qty.value, time: new Date().toLocaleString() });
            window.showAlert("전송 완료");
            wBill.value = ""; qty.value = "";
        }
    };

    window.addEventListener("load", function() {
        setTimeout(function() {
            var u = localStorage.getItem("rl_uid"), c = localStorage.getItem("rl_ucamp");
            if (u && c) window.loginSuccess(u, c);
        }, 800);
    });
})();
