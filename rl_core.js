(function() {
    // 🔗 파이어베이스 창고 주소 (윈도우 7 호환성을 위해 var 사용)
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    // 데이터 저장 함수
    window.logToFirebase = function(data) {
        try {
            var timestamp = new Date().getTime();
            fetch(DB_URL + "logs/" + timestamp + ".json", {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        } catch(e) { console.log("DB 저장 실패:", e); }
    };

    // 0. 🔥 주소 숨기는 커스텀 알림창
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
        btn.style = "width:100%;padding:14px;background:#152b52;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:900;cursor:pointer;";
        btn.onclick = function() { document.body.removeChild(overlay); };
        box.appendChild(text); box.appendChild(btn); overlay.appendChild(box);
        document.body.appendChild(overlay);
    };

    // 1. 보안 도메인 체크
    var d = "jun5238.github.io";
    if (window.location.hostname !== "" && !window.location.hostname.includes(d) && !window.location.hostname.includes("localhost")) {
        alert("🚨 보안 경고: 무단 복제된 페이지입니다.");
        document.documentElement.innerHTML = "접근 차단됨";
        return;
    }

    // 2. 로그인 및 접속 처리
    window.saveInfo = function() {
        try {
            var a = document.getElementById("user-id").value;
            var b = document.getElementById("user-camp").value;
            
            if (!a || !b) return showAlert("⚠️<br>아이디와 소속 캠프를<br>정확히 입력해주세요.");
            
            // VIP_LIST 체크 (오류 방지 위해 체크 추가)
            if (typeof VIP_LIST !== "undefined" && !VIP_LIST.includes(a)) {
                return showAlert("🚨 미승인 아이디입니다.<br>관리자에게 승인을 요청하세요.");
            }
            
            localStorage.setItem("rl_uid", a);
            localStorage.setItem("rl_ucamp", b);
            
            document.getElementById("form-id").value = a;
            document.getElementById("form-camp").value = b;
            document.getElementById("display-id").innerText = a;
            document.getElementById("display-camp").innerText = b;
            
            document.getElementById("setup-view").style.display = "none";
            document.getElementById("main-view").style.display = "block";
        } catch(e) {
            alert("로그인 처리 중 오류가 발생했습니다: " + e.message);
        }
    };

    // 3. 폼 전송
    window.submitForm = function() {
        var btn = document.getElementById("submitBtn");
        var uid = localStorage.getItem("rl_uid");
        var camp = localStorage.getItem("rl_ucamp");
        var waybill = document.getElementById("waybill").value;
        var qty = document.getElementById("quantity").value;

        logToFirebase({
            user: uid,
            camp: camp,
            waybill: waybill,
            quantity: qty,
            time: new Date().toLocaleString()
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

    // 4. 자동 로그인
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
