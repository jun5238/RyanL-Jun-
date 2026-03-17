window.onload = function() {
    setTimeout(() => document.getElementById('splash-screen').style.display='none', 1500);
    db.ref("승인대기방").on('value', (s) => {
        const b = document.getElementById('admin-badge');
        const c = s.val() ? Object.keys(s.val()).length : 0;
        b.innerText = c; b.style.display = c > 0 ? 'block' : 'none';
    });
    const sid = localStorage.getItem('ryanl_id'), scamp = localStorage.getItem('ryanl_camp');
    if (sid && sid !== 'ryanl82') showMain(sid, scamp);
    else showSetup();
};
function myAlert(msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert-box').style.display = 'flex';
}
function saveInfo() {
    const id = document.getElementById('user-id').value.trim();
    if (id === 'ryanl82') {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
    } else {
        localStorage.setItem('ryanl_id', id);
        localStorage.setItem('ryanl_camp', document.getElementById('user-camp').value);
        showMain(id, document.getElementById('user-camp').value);
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
    document.getElementById('main-view').style.display='none';
    document.getElementById('admin-login-view').style.display='none';
    document.getElementById('admin-dashboard-view').style.display='none';
    document.getElementById('setup-view').style.display='block';
}
