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
