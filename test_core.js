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

    if (!userId) {
        myAlert("아이디를 입력해주세요.");
        return;
    }

    // 관리자 아이디 체크 (비밀번호는 여기서 노출 안됨)
    if (userId === 'ryanl82') {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
        return;
    }

    if (!userCamp) {
        myAlert("캠프를 선택해주세요.");
        return;
    }

    db.ref("users/" + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.approved === true) {
            localStorage.setItem('ryanl_id', userId);
            localStorage.setItem('ryanl_camp', userCamp);
            showMain(userId, userCamp);
        } else {
            document.getElementById('custom-alert-overlay').style.display = 'flex';
            document.getElementById('req-id').value = userId;
        }
    });
}

// 비밀번호 검증 (서버의 데이터와 직접 대조, 코드 내 비번 없음)
function checkAdminPw() {
    const pwInput = document.getElementById('admin-pw').value;
    const adminId = 'ryanl82';
    
    // 파이어베이스 DB의 admins 노드에서 비번을 가져와 비교
    db.ref("admins/" + adminId).once('value', (snapshot) => {
        const adminData = snapshot.val();
        if (adminData && pwInput === adminData.pw) {
            document.getElementById('admin-login-view').style.display = 'none';
            document.getElementById('admin-dashboard-view').style.display = 'block';
            if (typeof loadApprovalList === 'function') loadApprovalList(); 
        } else {
            myAlert("인증 정보가 올바르지 않습니다.");
            document.getElementById('admin-pw').value = '';
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

function cancelAdmin() {
    showSetup();
}

function pasteClipboard() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('waybill').value = text;
    }).catch(err => { myAlert("권한이 필요합니다."); });
}
