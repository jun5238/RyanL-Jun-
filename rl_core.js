(function() {
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    window.logToFirebase = function(data) {
        try {
            fetch(DB_URL + "logs/" + new Date().getTime() + ".json", {
                method: 'PUT', body: JSON.stringify(data)
            });
        } catch(e) {}
    };

    // 🔥 정보변경 시 기억 완벽 삭제 & 입력창 초기화
    window.showSetup = function() {
        localStorage.removeItem("rl_uid");
        localStorage.removeItem("rl_ucamp");
        document.getElementById("user-id").value = ""; 
        document.getElementById("user-camp").value = ""; 
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

        var cleanUid = uid.trim().toLowerCase();

        // 👑 기존 리모컨이 혹시 숨어있다면 싹 지워버리고 새로 만듦!
        var existingBtn = document.getElementById("adminBtn");
        if (existingBtn) {
            existingBtn.parentNode.removeChild(existingBtn);
        }

        if (cleanUid === "ryanl82") {
            var btn = document.createElement("button");
            btn.id = "adminBtn";
            btn.innerHTML = "👑 기사님 승인 리모컨 (작동중) 👑";
            btn.style = "width:100%; padding:18px; margin-top:20px; margin-bottom:20px; background:#ff8c00; color:#fff; border:none; border-radius:10px; font-weight:900; font-size:18px; cursor:pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
            
            btn.onclick = function() {
                var newId = prompt("✅ 승인해줄 기사님의 아이디를 입력하세요:");
                if (newId && newId.trim() !== "") {
                    fetch(DB_URL + "users/" + newId.trim() + ".json", {
                        method: "PUT",
                        body: JSON.stringify(true)
                    }).then(function() {
                        alert(newId.trim() + " 기사님 승인이 완료되었습니다!");
                    }).catch(function() {
                        alert("승인 중 오류가 발생했습니다.");
                    });
                }
            };
            
            var submitBtn = document.getElementById("submitBtn");
            if (submitBtn && submitBtn.parentNode) {
                submitBtn.parentNode.insertBefore(btn, submitBtn.nextSibling);
            } else {
                document.getElementById("main-view").appendChild(btn);
            }
        }
    };

    window.processLogin = function(a, b) {
        if (!a || !b) return alert("아이디와 소속 캠프를 입력해주세요.");
        var cleanId = a.trim();
        var adminIdCheck = cleanId.toLowerCase();

        if (adminIdCheck === "ryanl82") {
            window.loginSuccess(cleanId, b);
        } else {
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
                    alert("서버와 연결할 수 없습니다.");
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
        var savedUid = localStorage.getItem("rl_uid");
        var savedCamp = localStorage.getItem("rl_ucamp");
        if (savedUid && savedCamp) {
            window.processLogin(savedUid, savedCamp);
        }
    };
})();
