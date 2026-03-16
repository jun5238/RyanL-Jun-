(function() {
    // ==========================================
    // 🔗 파이어베이스 창고 연결 설정
    // ==========================================
    const DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com";

    // 데이터 저장 함수 (창고에 한 줄 쌓기)
    window.logToFirebase = function(data) {
        const timestamp = new Date().getTime();
        fetch(`${DB_URL}/logs/${timestamp}.json`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    };

    // ==========================================
    // 0. 🔥 주소 숨기는 '커스텀 예쁜 알림창'
    // ==========================================
    window.showAlert = function(msg) {
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100vw'; overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.6)'; overlay.style.zIndex = '999999';
        overlay.style.display = 'flex'; overlay.style.justifyContent = 'center'; overlay.style.alignItems = 'center';
        var box = document.createElement('div');
        box.style.background = '#fff'; box.style.width = '80%'; box.style.maxWidth = '300px';
        box.style.borderRadius = '15px'; box.style.padding = '25px 20px'; box.style.textAlign = 'center';
        box.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        var text = document.createElement('div');
        text.innerHTML = msg; 
        text.style.fontSize = '16px'; text.style.fontWeight = '900'; text.style.color = '#152b52';
        text.style.marginBottom = '20px'; text.style.lineHeight = '1.5';
        var btn = document.createElement('button');
        btn.innerText = '확인';
        btn.style.width = '100%'; btn.style.padding = '14px'; btn.style.background = '#152b52';
        btn.style.color = '#fff'; btn.style.border = 'none'; btn.style.borderRadius = '10px';
        btn.style.fontSize = '16px'; btn.style.fontWeight = '900'; btn.style.cursor = 'pointer';
        btn.onclick = function() { document.body.removeChild(overlay); };
        box.appendChild(text); box.appendChild(btn); overlay.appendChild(box);
        document.body.appendChild(overlay);
    };

    // [중략 - 로그인/보안 체크 로직 유지]

    // ==========================================
    // 4. 🔥 폼 전송 (구글 전송 + 파이어베이스 백업!)
    // ==========================================
    window.submitForm = function() {
        var btn = document.getElementById("submitBtn");
        var uid = localStorage.getItem("rl_uid");
        var camp = localStorage.getItem("rl_ucamp");
        var waybill = document.getElementById("waybill").value;
        var qty = document.getElementById("quantity").value;

        // ✅ 파이어베이스 백업 창고에 즉시 저장
        logToFirebase({
            user: uid,
            camp: camp,
            waybill: waybill,
            quantity: qty,
            time: new Date().toLocaleString()
        });

        // 즉시 성공 알림
        showAlert("✅<br>성공적으로 제출되었습니다!");
        
        document.getElementById("waybill").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("waybill").focus();

        if(btn) {
            btn.disabled = true;
            btn.innerText = "✅ 전송완료 (잠시 대기)";
            btn.style.opacity = "0.5";
        }

        setTimeout(function() {
            if(btn) {
                btn.disabled = false;
                btn.innerText = "바로 제출하기";
                btn.style.opacity = "1";
            }
        }, 1500); 
    };

    // [이하 자동 로그인 로직 유지...]
})();
