(function() {
    // 🔗 파이어베이스 연결 주소
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    window.logToFirebase = function(data) {
        try {
            var timestamp = new Date().getTime();
            fetch(DB_URL + "logs/" + timestamp + ".json", {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch(e) { console.log("DB 저장 에러"); }
    };

    window.showAlert = function(msg) {
        var overlay = document.createElement('div');
        overlay.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);z-index:999999;display:flex;justify-content:center;align-items:center;";
        var box = document.createElement('div');
        box.style = "background:#fff;width:80%;max-width:300px;border-radius:15px;padding:25px 20px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.2);";
        var text = document.createElement('div');
        text.innerHTML = msg; 
        text.style = "font-size:16px;font-weight:900;color:#152b52;margin-bottom:20px;line-height:1.5;";
        var btn = document.createElement('button');
        btn.innerText = '확인';
        btn.style = "width:100%;padding:14px;background:#152b52;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:900;";
        btn.onclick = function() { document.body.removeChild(overlay); };
        box.appendChild(text); box.appendChild(btn); overlay.appendChild(box);
        document.body.appendChild(overlay);
    };

    // 2. 로그인 처리 (julee82 & ryanl82 쌍끌이 프리패스!)
    window.saveInfo = function() {
        var a = document.getElementById("user-id").value;
        var b = document.getElementById("user-camp").value;
        
        if (!a || !b) return showAlert("⚠️<br>아이디와 소속 캠프를<br>입력해주세요.");
        
        // 🔥 기사님(julee82)과 관리자(ryanl82)는 묻지도 따지지도 않고 통과!
        if (a === "julee82" || a === "ryanl82") {
            // 프리패스 구간
        } else {
            // 일반 사용자만 VIP_LIST 검사
            if (typeof VIP_LIST === "undefined" || !VIP_LIST.includes(a)) {
                return showAlert("🚨 미승인 아이디입니다.<br>관리자에게 승인을 요청하세요.");
            }
        }
        
        localStorage.setItem("rl_uid", a);
        localStorage.setItem("rl_ucamp", b);
        
        document.getElementById("form-id").value = a;
        document.getElementById("form-camp").value = b;
        document.getElementById("display-id").innerText = a;
        document.getElementById("display-camp").innerText = b;
        
        document.getElementById("setup-view").style.display = "none";
        document.getElementById("main-view").style.display = "block";
    };

    window.submitForm = function() {
        var btn = document.getElementById("submitBtn");
        var uid = localStorage.getItem("rl_uid") || "unknown";
        var camp = localStorage.getItem("rl_ucamp") || "unknown";
        var waybill = document.getElementById("waybill").value;
        var qty = document.getElementById("quantity").value;

        // 파이어베이스 창고에 차곡차곡 저장
        logToFirebase({
            user: uid, camp: camp, waybill: waybill, quantity: qty, time: new Date().toLocaleString()
        });

        showAlert("✅<br>성공적으로 제출되었습니다!");
        
        document.getElementById("waybill").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("waybill").focus();

        if(btn) {
            btn.disabled = true;
            btn.innerText = "✅ 전송완료 (잠시 대기)";
            btn.style.opacity = "0.5";
            setTimeout(function() {
                btn.disabled = false;
                btn.innerText = "바로 제출하기";
                btn.style.opacity = "1";
            }, 1500);
        }
    };

    window.onload = function() {
        var a = localStorage.getItem("rl_uid");
        var b = localStorage.getItem("rl_ucamp");
        if (a && b) {
            document.getElementById("user-id").value = a;
            document.getElementById("user-camp").value = b;
            window.saveInfo();
        }
    };
})();
