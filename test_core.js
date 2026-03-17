window.onload = function() {
    // 스플래시 화면 1.5초 후 제거
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
    }, 1500);

    const savedId = localStorage.getItem('ryanl_id');
    const savedCamp = localStorage.getItem('ryanl_camp');

    // 파이어베이스 DB에서 승인된 사용자인지 실시간 확인 후 자동 로그인
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

    // 파이어베이스 DB에서 승인 여부 확인
    db.ref("users/" + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.approved === true && userData.camp === userCamp) {
            localStorage.setItem('ryanl_id', userId);
            localStorage.setItem('ryanl_camp', userCamp);
            showMain(userId, userCamp);
        } else {
            // 미승인 사용자인 경우 승인 요청 팝업 띄우기
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

// [핵심] 관리자 모드 진입 (로고 꾹 누르기)
const headerLogo = document.querySelector('.logo-img');
let pressTimer;

if (headerLogo) {
    // 꾹 누르기 시작
    headerLogo.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            // 모든 뷰 숨기고 관리자 로그인 뷰만 보이기
            document.getElementById('setup-view').style.display = 'none';
            document.getElementById('main-view').style.display = 'none';
            document.getElementById('admin-login-view').style.display = 'block';
        }, 1500); // 1.5초 동안 누르면 작동
    });

    // 떼거나 움직이면 타이머 취소
    headerLogo.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
    });
    headerLogo.addEventListener('touchmove', function() {
        clearTimeout(pressTimer);
    });
}
