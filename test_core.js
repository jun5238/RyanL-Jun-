window.onload = function() {
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
    }, 1500);

    // 기사님 관리자 정보 파이어베이스 고정
    db.ref("admins/ryanl82").set({
        pw: "jun0312",
        name: "관리자"
    });

    const savedId = localStorage.getItem('ryanl_id');
    const savedCamp = localStorage.getItem('ryanl_camp');

    if (savedId && savedCamp) {
        // 관리자 아이디로 저장되어 있다면 바로 관리자 화면 시도
        if (savedId === 'ryanl82') {
             showSetup(); // 관리자는 보안상 다시 로그인하게 유도
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

// 기사님 약속: 주소창 없는 myAlert
function myAlert(msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert-box').style.display = 'flex';
}

// [핵심] 로그인 버튼 하나로 관리자까지 체크
function saveInfo() {
    const userId = document.getElementById('user-id').value.trim();
    const userCamp = document.getElementById('user-camp').value;

    if (!userId) {
        myAlert("아이디를 입력해주세요.");
        return;
    }

    // 1. 관리자 아이디(ryanl82)인지 먼저 확인
    if (userId === 'ryanl82') {
        // 관리자면 바로 비번 입력창으로 전환
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
        return;
    }

    // 2. 일반 기사님 로그인 로직
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

// 관리자 비번 확인 (비번: jun0312)
function checkAdminPw() {
    const pwInput = document.getElementById('admin-pw').value;
    
    db.ref("admins/ryanl82").once('value', (snapshot) => {
        const adminData = snapshot.val();
        if (adminData && pwInput === adminData.pw) {
            document.getElementById('admin-login-view').style.display = 'none';
            document.getElementById('admin-dashboard-view').style.display = 'block';
            if (typeof loadApprovalList === 'function') loadApprovalList(); 
        } else {
            myAlert("비밀번호가 틀렸습니다!");
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
