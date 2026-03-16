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

    window.showSetup = function() {
        document.getElementById("main-view").style.display = "none";
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
        document.getElementById("main-view").style.display = "block";

        // 🔥 오직 '지휘관(ryanl82)'에게만 리모컨 버튼 생성!
        if (uid === "ryanl82") {
            if (!document.getElementById("adminBtn")) {
                var btn = document.createElement("button");
                btn.id = "adminBtn";
                btn.innerText = "👑 기사님 승인 리모컨";
                btn.style = "width:100%; padding:15px; margin-top:15px; background:#ff8c00; color:#fff; border:none; border-radius:10px; font-weight:bold; font-size:16px; cursor:pointer;";
                btn.onclick = function() {
                    var newId = prompt("✅ 승인해줄 기사님의 아이디를 입력하세요:");
                    if (newId && newId.trim() !== "") {
                        fetch(DB_URL + "users/" + newId + ".json", {
                            method: "PUT",
                            body: JSON.stringify(true)
                        }).then(function() {
                            alert(newId + " 기사님 승인이 완료되었습니다!\n이제 바로 로그인 가능합니다.");
                        }).catch(function() {
                            alert("승인 중 오류가 발생했습니다.");
                        });
                    }
                };
                document.getElementById("main-view").appendChild(btn);
            }
        } else {
            // 일반 기사님(julee82 포함) 화면에는 리모컨이 절대 안 보이게 처리
            var existingBtn = document.getElementById("adminBtn");
            if (existingBtn) existingBtn.style.display = "none";
        }
    };

    window.saveInfo = function() {
        var a = document.getElementById("user-id").value;
        var b = document.getElementById("user-camp").value;
        
        if (!a || !b) return alert("아이디와 소속 캠프를 입력해주세요.");
        
        // 🔥 관리자 ryanl82만 무조건 프리패스
        if (a === "ryanl82") {
            window.loginSuccess(a, b);
        } else {
            // 🚚 julee82를 포함한 모든 현장 기사님은 파이어베이스 승인 검사!
            fetch(DB_URL + "users/" + a + ".json")
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data === true) {
                    window.loginSuccess(a, b);
                } else {
                    // 기사님 오리지널 양식 완벽 유지
                    alert("🚨 미승인 아이디입니다.\n\n[승인 요청 방법]\n아래 이메일로 양식에 맞춰 승인을 요청해주세요.\n\n📧 이메일: cndrone@naver.com\n📝 양식: [캠프명 / 이름 / 아이디]");
                }
            })
            .catch(function(e) {
                alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
            });
        }
    };

    window.submitForm = function() {
        var btn = document.getElementById("submitBtn");
        var uid = localStorage.getItem("rl_uid") || "unknown";
        var camp = localStorage.getItem("rl_ucamp") || "unknown";
        var waybill = document.getElementById("waybill").value;
        var qty = document.getElementById("quantity").value;

        logToFirebase({
            user: uid, camp: camp, waybill: waybill, quantity: qty, time: new Date().toLocaleString()
        });

        alert("성공적으로 제출되었습니다!");
        
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
