window.onload = function() {
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
    }, 1500);

    const savedId = localStorage.getItem('ryanl_id');
    const savedCamp = localStorage.getItem('ryanl_camp');

    if (savedId && savedCamp) {
        if (savedId === 'ryanl82') {
             showSetup(); 
        } else {
            db.ref("users/" + savedId).once('value', (snapshot) => {
                const userData = snapshot.val();
                if (userData && userData.approved === true) {
                    showMain(savedId, savedCamp);
                } else {
                    showSetup();
                }
            });
        }
    } else {
        showSetup();
    }
};

function myAlert(msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert-box').style.display = 'flex';
}

function saveInfo() {
    const userId = document.getElementById('user-id').value.trim();
    const userCamp = document.getElementById('user-camp').value;

    if (!userId) { myAlert("아이디를 입력해주세요."); return; }

    if (userId === 'ryanl82') {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
        return;
    }

    if (!userCamp) { myAlert("캠프를 선택해주세요."); return; }

    db.ref("users/" + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.approved === true) {
            localStorage.setItem('ryanl_id', userId);
            localStorage.setItem('ryanl_camp', userCamp);
            showMain(userId, userCamp);
        } else {
            db.ref("승인대기방/" + userId).once('value', (pendingSnap) => {
                if (pendingSnap.exists()) {
                    myAlert("⏳ 현재 관리자 승인 대기 중입니다!\n처리가 완료될 때까지 조금만 기다려주세요.");
                } else {
                    db.ref("승인거절방/" + userId).once('value', (rejectSnap) => {
                        const rejectData = rejectSnap.val();
                        if (rejectData) {
                            myAlert("❌ 승인이 반려되었습니다.\n\n사유: " + rejectData.reason + "\n\n정보를 수정하여 다시 신청해주세요!");
                        }
                        document.getElementById('custom-alert-overlay').style.display = 'flex';
                        document.getElementById('req-id').value = userId;
                    });
                }
            });
        }
    });
}

function showMain(id, camp) {
    document.getElementById('setup-view').style.display = 'none';
    document.getElementById('main-view').style.display = 'block';
    document.getElementById('display-id').innerText = id;
    document.getElementById('display-camp').innerText = camp;
    document.getElementById('form-id').value = id;
    document.getElementById('form-camp').value = camp;

    // 📢 로그인 성공 시 공지사항 확인해서 한 번만 띄워주기!
    if(!sessionStorage.getItem('noticeShown')) {
        db.ref("공지사항").once('value', snap => {
            const val = snap.val();
            if(val && val.text) {
                myAlert("📢 [전체 공지사항]\n\n" + val.text);
            }
            sessionStorage.setItem('noticeShown', 'true'); // 이번 로그인에서는 다시 안 띄움
        });
    }
}

function showSetup() {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('setup-view').style.display = 'block';
}

function toggleGuide() {
    const content = document.getElementById('guide-content');
    content.style.display = (content.style.display === 'block') ? 'none' : 'block';
}

function pasteClipboard() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('waybill').value = text;
    }).catch(err => { myAlert("권한이 필요합니다."); });
}

function sendFeedbackPrompt() {
    const modal = document.createElement('div');
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;";

    const box = document.createElement('div');
    box.style = "background:#fff;width:80%;max-width:300px;border-radius:15px;padding:25px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);";

    const text = document.createElement('div');
    text.innerText = "💡 시스템 피드백 보내기";
    text.style = "font-size:16px;font-weight:900;color:#152b52;margin-bottom:15px;";

    const input = document.createElement('textarea');
    input.placeholder = "개선점이나 오류를 자유롭게 적어주세요!";
    input.style = "width:100%;height:100px;padding:12px;margin-bottom:20px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;resize:none;font-family:inherit;";

    const btnGroup = document.createElement('div');
    btnGroup.style = "display:flex;gap:10px;";

    const okBtn = document.createElement('button');
    okBtn.innerText = "전송하기";
    okBtn.style = "width:50%;padding:12px;background:#9b59b6;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;";

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = "취소";
    cancelBtn.style = "width:50%;padding:12px;background:#ccc;color:#333;border:none;border-radius:10px;font-weight:bold;cursor:pointer;";

    okBtn.onclick = () => {
        const val = input.value.trim();
        if(!val) { myAlert("내용을 입력해주세요!"); return; }
        
        const userId = localStorage.getItem('ryanl_id') || '로그인 전 사용자';
        
        db.ref("피드백방").push({
            id: userId,
            text: val,
            timestamp: new Date().getTime()
        }).then(() => {
            document.body.removeChild(modal);
            myAlert("소중한 피드백이 전송되었습니다!\n더 나은 시스템을 위해 노력하겠습니다. 😊");
        }).catch(() => {
            myAlert("전송 중 오류가 발생했습니다.");
        });
    };

    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };

    btnGroup.appendChild(okBtn);
    btnGroup.appendChild(cancelBtn);
    box.appendChild(text);
    box.appendChild(input);
    box.appendChild(btnGroup);
    modal.appendChild(box);
    document.body.appendChild(modal);
}
