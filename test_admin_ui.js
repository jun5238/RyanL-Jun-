function checkAdminPw() {
    const pw = document.getElementById('admin-pw').value;
    db.ref("admins/ryanl82").once('value', (s) => {
        if (s.val() && pw === s.val().pw) {
            document.getElementById('admin-login-view').style.display = 'none';
            document.getElementById('admin-dashboard-view').style.display = 'block';
            loadApprovalRequests();
        } else myAlert("비번 틀림!");
    });
}
function loadApprovalRequests() {
    db.ref("승인대기방").on('value', (snapshot) => {
        const list = document.getElementById('admin-list-content');
        list.innerHTML = '';
        const data = snapshot.val();
        if (!data) return list.innerHTML = "대기 없음";
        Object.keys(data).forEach(key => {
            const u = data[key];
            const card = document.createElement('div');
            card.style.cssText = "background:rgba(255,255,255,0.1); padding:15px; border-radius:10px; margin-bottom:10px; border-left:5px solid #ff8c00;";
            card.innerHTML = `
                <div style="color:#ff8c00; font-weight:bold;">ID: ${u.id}</div>
                <div>${u.name} / ${u.company}</div>
                <div style="margin-top:10px;">
                    <button onclick="approveUser('${u.id}','${u.name}','${u.company}','${u.camp}')" style="background:#2ecc71; color:white; border:none; padding:8px; border-radius:5px;">승인</button>
                    <button onclick="rejectUser('${u.id}')" style="background:#e74c3c; color:white; border:none; padding:8px; border-radius:5px;">거절</button>
                </div>`;
            list.appendChild(card);
        });
    });
}
function approveUser(id, name, company, camp) {
    if(!confirm("승인?")) return;
    db.ref("users/" + id).set({ id, name, company, camp, approved: true })
    .then(() => db.ref("승인대기방/" + id).remove())
    .then(() => myAlert("완료!"));
}
function rejectUser(id) {
    if(!confirm("거절(삭제)?")) return;
    db.ref("승인대기방/" + id).remove().then(() => myAlert("삭제됨"));
}
