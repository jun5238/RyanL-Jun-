(function() {
    var DB_URL = "https://ryanl-logistics-default-rtdb.firebaseio.com/";

    window.logToFirebase = function(data) {
        try {
            fetch(DB_URL + "logs/" + new Date().getTime() + ".json", {
                method: 'PUT', body: JSON.stringify(data)
            });
        } catch(e) {}
    };

    window.showSetup = function() {
        localStorage.removeItem("rl_uid");
        localStorage.removeItem("rl_ucamp");
        var uidInput = document.getElementById("user-id");
        var campInput = document.getElementById("user-camp");
        if(uidInput) uidInput.value = ""; 
        if(campInput) campInput.value = ""; 
        
        // 모든 화면 끄고 로그인 화면만 켜기
        document.getElementById("main-view").style.display = "none";
        var adminDash = document.getElementById("admin-dashboard-view");
        if(adminDash) adminDash.style.display = "none";
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

        var cleanUid = uid.trim().toLowerCase();

        var existingBtn = document.getElementById("adminBtn");
        if (existingBtn) {
            existingBtn.parentNode.removeChild(existingBtn);
        }

        // 🔥 관리자(ryanl82)는 사령부(대시보드)로 이동!
        if (cleanUid === "ryanl82") {
            document.getElementById("main-view").style.display = "none"; // 운송장 끄기
            
            var adminDash = document.getElementById("admin-dashboard-view");
            if (adminDash) {
                adminDash.style.display = "block"; // 대시보드 켜기

                // 대시보드에 리모컨 달아주기
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
                
                // '로그인 화면으로' 버튼 바로 위에 예쁘게 추가
                var closeBtn = adminDash.querySelector("button[onclick='closeAdmin()']");
                if (closeBtn) {
                    adminDash.insertBefore(btn, closeBtn);
                } else {
                    adminDash.appendChild(btn);
                }
            }
        } else {
            // 🔥 일반 기사님은 기존대로 현장(운송장 화면)으로 이동!
            document.getElementById("main-view").style.display = "block";
            var adminDash = document.getElementById("admin-dashboard-view");
            if(adminDash) adminDash.style.display = "none";
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
                    // 🔥 기사님이 만드신 예쁜 팝업창 연결!
                    var customAlert = document.getElementById('custom-alert-overlay');
                    if (customAlert) {
                        customAlert.style.display = 'flex';
                    } else {
                        alert("🚨 미승인 아이디입니다.\n관리자에게 문의하세요.");
                    }
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

    // 새로고침 방어
    window.onload = function() {
        setTimeout(function() {
            var savedUid = localStorage.getItem("rl_uid");
            var savedCamp = localStorage.getItem("rl_ucamp");
            if (savedUid && savedCamp) {
                var uidInput = document.getElementById("user-id");
                var campInput = document.getElementById("user-camp");
                if (uidInput) uidInput.value = savedUid;
                if (campInput) campInput.value = savedCamp;
                window.processLogin(savedUid, savedCamp);
            }
        }, 100);
    };
})();
