(function() {
    // ==========================================
    // 1. 보안 도메인 체크 (기존 로직 100% 유지)
    // ==========================================
    var d = "jun5238.github.io";
    if ("" !== window.location.hostname && !window.location.hostname.includes(d) && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
        alert("🚨 경고: 불법 복제된 시스템입니다.\nRyanL 로지스틱스의 자산으로 무단 도용을 금지합니다.");
        document.documentElement.innerHTML = "<div style='display:flex;height:100vh;width:100vw;background:#152b52;color:white;align-items:center;justify-content:center;font-size:24px;font-weight:bold;flex-direction:column;'><p>🚨 접근 차단됨</p><p style='font-size:16px;color:#ff8c00;'>무단 도용 앱입니다.</p></div>";
        throw new Error("Unauthorized");
    }

    // ==========================================
    // 2. 로그인 및 접속 처리 (기존 로직 유지 + 커스텀 팝업 연동)
    // ==========================================
    window.saveInfo = function() {
        var a = document.getElementById("user-id").value;
        var b = document.getElementById("user-camp").value;
        
        if (!a || !b) return alert("아이디와 소속 캠프를 정확히 입력해주세요.");
        
        if ("undefined" !== typeof VIP_LIST && !VIP_LIST.includes(a)) {
            // 기사님이 만든 예쁜 커스텀 팝업 띄우기
            var overlay = document.getElementById('custom-alert-overlay');
            if(overlay) {
                overlay.style.display = 'flex';
                return;
            } else {
                return alert("🚨 미승인 아이디입니다.\n관리자에게 승인을 요청하세요.");
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
    // 4. 🔥 폼 전송 (중복 클릭 2.5초 잠금 기능 추가) 🔥
    // ==========================================
    window.submitForm = function() {
        var btn = document.getElementById("submitBtn");
        
        // 1단계: 버튼을 누르자마자 즉시 잠그고 흐리게 만들기
        if(btn) {
            btn.disabled = true;
            btn.innerText = "⏳ 전송 중... (잠시 대기)";
            btn.style.opacity = "0.5";
        }

        // 2단계: 2.5초(2500ms) 뒤에 입력칸 비우고 버튼 원상복구
        setTimeout(function() {
            // 기존에 있던 성공 알림창 띄우기
            alert("✅ 성공적으로 제출되었습니다!");
            
            // 입력칸 깔끔하게 비우고 다음 입력 준비
            document.getElementById("waybill").value = "";
            document.getElementById("quantity").value = "";
            document.getElementById("waybill").focus();

            // 버튼 잠금 해제
            if(btn) {
                btn.disabled = false;
                btn.innerText = "바로 제출하기";
                btn.style.opacity = "1";
            }
        }, 2500); // 2.5초 대기
    };

    // ==========================================
    // 5. 앱 켜질 때 자동 로그인 로직 (기존 유지)
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
