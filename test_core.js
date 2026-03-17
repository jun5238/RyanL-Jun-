window.onload = function() {
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
    }, 1500);

    const savedId = localStorage.getItem('ryanl_id');
    const savedCamp = localStorage.getItem('ryanl_camp');

    if (savedId && savedCamp) {
        db.ref("users/" + savedId).once('value', (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.approved === true && userData.camp === savedCamp) {
                showMain(savedId, savedCamp);
            } else {
                showSetup();
            }
        });
    } else {
        showSetup();
    }
};

function saveInfo() {
    const userId = document.getElementById('user-id').value.trim();
    const userCamp = document.getElementById('user-camp').value;

    if (!userId || !userCamp) {
        alert("아이디와 캠프를 입력해주세요.");
        return;
    }

    db.ref("users/" + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.approved === true && userData.camp === userCamp) {
            localStorage.setItem('ryanl_id', userId);
            localStorage.setItem('ryanl_camp', userCamp);
            showMain(userId, userCamp);
        } else {
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
    document.getElementById('setup-view').style.display = 'block';
}

function toggleGuide() {
    const content = document.getElementById('guide-content');
    content.style.display = (content.style.display === 'block') ? 'none' : 'block';
}

function pasteClipboard() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('waybill').value = text;
    }).catch(err => {
        alert("붙여넣기 권한이 필요합니다.");
    });
}

// 로고 클릭 시 관리자 모드 진입 (기존 방식으로 복구)
const headerLogo = document.querySelector('.logo-img');
if (headerLogo) {
    headerLogo.onclick = function() {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('main-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
    };
}
