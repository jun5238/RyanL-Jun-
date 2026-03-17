window.onload = function() {
    setTimeout(() => document.getElementById('splash-screen').style.display = 'none', 1500);
    
    db.ref("승인대기방").on('value', (s) => {
        const badge = document.getElementById('admin-badge');
        const count = s.val() ? Object.keys(s.val()).length : 0;
        badge.innerText = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    });

    const sid = localStorage.getItem('ryanl_id'), scamp = localStorage.getItem('ryanl_camp');
    if (sid && scamp && sid !== 'ryanl82') {
        db.ref("users/" + sid).once('value', (s) => {
            if (s.val() && s.val().approved) showMain(sid, scamp);
            else showSetup();
        });
    } else showSetup();
};

function myAlert(msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert-box').style.display = 'flex';
}

function saveInfo() {
    const id = document.getElementById('user-id').value.trim();
    const camp = document.getElementById('user-camp').value;
    if (!id) return myAlert("아이디 입력!");
    if (id === 'ryanl82') {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
    } else {
        db.ref("users/" + id).once('value', (s) => {
            if (s.val() && s.val().approved) {
                localStorage.setItem('ryanl_id', id);
                localStorage.setItem('ryanl_camp', camp);
                showMain(id, camp);
            } else {
                document.getElementById('custom-alert-overlay').style.display = 'flex';
                document.getElementById('req-id').value = id;
            }
        });
    }
}

function sendApprovalRequest() {
    const id = document.getElementById('req-id').value.trim();
    const name = document.getElementById('req-name').value.trim();
    const company = document.getElementById('req-company').value.trim();
    const camp = document.getElementById('user-camp').value;
    db.ref("승인대기방/" + id).set({ id, name, company, camp, timestamp: new Date().getTime() })
    .then(() => {
        document.getElementById('custom-alert-overlay').style.display = 'none';
        myAlert("신청 완료! 관리자 승인을 기다려주세요.");
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
    document.getElementById('main-view').style.display='none';
    document.getElementById('admin-login-view').style.display='none';
    document.getElementById('admin-dashboard-view').style.display='none';
    document.getElementById('setup-view').style.display='block';
}

function pasteClipboard() {
    navigator.clipboard.readText().then(t => document.getElementById('waybill').value = t);
}
