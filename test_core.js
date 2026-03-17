window.onload = function() {
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
    }, 1500);

    const savedId = localStorage.getItem('ryanl_id');
    const savedCamp = localStorage.getItem('ryanl_camp');

    if (savedId && savedCamp) {
        if (VIP_LIST[savedId] && VIP_LIST[savedId].camp === savedCamp) {
            showMain(savedId, savedCamp);
        } else {
            showSetup();
        }
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

    if (VIP_LIST[userId] && VIP_LIST[userId].camp === userCamp) {
        localStorage.setItem('ryanl_id', userId);
        localStorage.setItem('ryanl_camp', userCamp);
        showMain(userId, userCamp);
    } else {
        document.getElementById('custom-alert-overlay').style.display = 'flex';
        document.getElementById('req-id').value = userId;
    }
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

const headerLogo = document.querySelector('.logo-img');
let pressTimer;
if (headerLogo) {
    headerLogo.addEventListener('touchstart', function() {
        pressTimer = setTimeout(() => {
            document.getElementById('setup-view').style.display = 'none';
            document.getElementById('main-view').style.display = 'none';
            document.getElementById('admin-login-view').style.display = 'block';
        }, 2000);
    });
    headerLogo.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
    });
}
