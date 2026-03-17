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

// [보안] 주소창 없는 알림창
function myAlert(msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert-box').style.display = 'flex';
}

// [메인] 로그인 버튼 클릭 시
function saveInfo() {
    const userId = document.getElementById('user-id').value.trim();
    const userCamp = document.getElementById('user-camp').value;

    if (!userId) { myAlert("아이디를 입력해주세요."); return; }

    // 관리자 아이디 체크
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
            // 미승인 시 신청 팝업 띄움
            document.getElementById('custom-alert-overlay').style.display = 'flex';
            document.getElementById('req-id').value = userId;
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
