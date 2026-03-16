(function() {
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

        // 🔥 관리자 아이디 띄어쓰기/대소문자 실수 완벽 방어
        var adminIdCheck = uid.trim().toLowerCase();

        // 관리자일 경우 제출버튼 바로 밑에 리모컨 소환!
        if (adminIdCheck === "ryanl82") {
            var btn = document.getElementById("adminBtn");
            if (!btn) {
                btn = document.createElement("button");
                btn.id = "adminBtn";
                btn.innerText = "👑 기사님 승인 리모컨 👑";
                btn.style = "width:100%; padding:18px; margin-top:20px; margin-bottom:20px; background:#ff8c00; color:#fff; border:none; border-radius:10px; font-weight:900; font-size:18px; cursor:pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
                
                btn.onclick = function() {
                    var newId = prompt("✅ 승인해줄 기사님의 아이디를 입력하세요:");
                    if (newId && newId.trim() !== "") {
                        fetch(DB_URL + "users/" + newId.trim() + ".json", {
                            method: "PUT",
                            body: JSON.stringify(true)
                        }).then(function() {
                            alert(newId.trim() + " 기사님 승인이 완료되었습니다!\n이제 바로 로그인 가능합니다.");
                        }).catch(function() {
                            alert("승인 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
                        });
                    }
                };
                
                // 제출 버튼(submitBtn) 찾아서 바로 그 밑에 눈에 띄게 추가
                var submitBtn = document.getElementById("submitBtn");
                if (submitBtn) {
                    submitBtn.parentNode.insertBefore(btn, submitBtn.nextSibling);
                } else {
                    document.getElementById("main-view").appendChild(btn);
                }
            }
            btn.style.display = "block"; // 무조건 보이게 강제
        } else {
            // 일반 기사님 화면에서는 리모컨 절대 숨김
            var existingBtn = document.getElementById("adminBtn");
            if (existingBtn) existingBtn.style.display = "none";
        }
    };

    window.saveInfo = function() {
        var a = document.getElementById("user-id").value;
        var b = document.getElementById("user-camp").value;
        
        if (!a || !b) return alert("아이디와 소속 캠프를 입력해주세요.");
        
        var cleanId = a.trim(); // 띄어쓰기 실수 제거
        var adminIdCheck = cleanId.toLowerCase();

        // 1. 관리자 ryanl82 무조건 통과
        if (adminIdCheck === "ryanl82") {
            window.loginSuccess(cleanId, b);
        } else {
            // 2. 파이어베이스(새 창고) + VIP_LIST(옛날 명부) 동시 검사
            fetch(DB_URL + "users/" + cleanId + ".json")
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data === true || (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId))) {
                    window.loginSuccess(cleanId, b);
                } else {
                    alert("🚨 미승인 아이디입니다.\n\n[승인 요청 방법]\n아래 이메일로 양식에 맞춰 승인을 요청해주세요.\n\n📧 이메일: cndrone@naver.com\n📝 양식: [캠프명 / 이름 / 아이디]");
                }
            })
            .catch(function(e) {
                if (typeof VIP_LIST !== "undefined" && VIP_LIST.includes(cleanId)) {
                    window.loginSuccess(cleanId, b);
                } else {
                    alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
                }
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
