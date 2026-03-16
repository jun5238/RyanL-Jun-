(function() {
    // ==========================================
    // 0. 🔥 주소 숨기는 '커스텀 예쁜 알림창' 제조기 🔥
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
        
        // 확인 버튼 누르면 팝업창 닫기
        btn.onclick = function() { document.body.removeChild(overlay); };
        
        box.appendChild(text); box.appendChild(btn); overlay.appendChild(box);
        document.body.appendChild(overlay);
    };

    // ==========================================
    // 1. 보안 도메인 체크 (불법 복제 방지)
    // ==========================================
    var d = "jun5238.github.io";
    if ("" !== window.location.hostname && !window.location.hostname.includes(d) && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
        alert("🚨 경고: 불법 복제된 시스템입니다.\nRyanL 로지스틱스의 자산으로 무단 도용을 금지합니다.");
        document.documentElement.innerHTML = "<div style='display:flex;height:100vh;width:100vw;background:#152b52;color:white;align-items:center;justify-content:center;font-size:24px;font-weight:bold;flex-direction:column;'><p>🚨 접근 차단됨</p><p style='font-size:16px;color:#ff8c00;'>무단 도용 앱입니다.</p></div>";
        throw new Error("Unauthorized");
    }

    // ==========================================
    // 2. 로그인 및 접속 처리
    // ==========================================
    window.saveInfo = function() {
        var a = document.getElementById("user-id").value;
        var b = document.getElementById("user-camp").value;
        
        if (!a || !b) return showAlert("⚠️<br>아이디와 소속 캠프를<br>정확히 입력해주세요.");
        
        if ("undefined" !== typeof VIP_LIST && !VIP_LIST.includes(a)) {
            var overlay = document.getElementById('custom-alert-overlay');
            if(overlay) {
                overlay.style.display = 'flex';
                return;
            } else {
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

    // ==========================================
    // 3. 정보 변경 화면으로 돌아가기
    // ==========================================
    window.showSetup = function() {
        document.getElementById("main-view").style.display = "none";
        document.getElementById("setup-view").style.display = "block";
    };

    // ==========================================
    // 4. 🔥 폼 전송 (성질 급한 기사님들 맞춤형 즉시 완료!) 🔥
    // ==========================================
    window.submitForm = function() {
        var btn = document.getElementById("submitBtn");
        
        // 1단계: 누르자마자 즉시 예쁜 성공 팝업 띄우기!
        showAlert("✅<br>성공적으로 제출되었습니다!");
        
        // 2단계: 다음 채번 바로 하시라고 입력칸 즉시 비우기
        document.getElementById("waybill").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("waybill").focus();

        // 3단계: 버튼은 "전송완료"로 바꾸고 중복 클릭 못하게 즉시 잠금
        if(btn) {
            btn.disabled = true;
            btn.innerText = "✅ 전송완료 (잠시 대기)";
            btn.style.opacity = "0.5";
        }

        // 4단계: 딱 1.5초 뒤에 조용히 버튼만 다시 원래대로 살려놓기
        setTimeout(function() {
            if(btn) {
                btn.disabled = false;
                btn.innerText = "바로 제출하기";
                btn.style.opacity = "1";
            }
        }, 1500); 
    };

    // ==========================================
    // 5. 앱 켜질 때 자동 로그인
    // ==========================================
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
