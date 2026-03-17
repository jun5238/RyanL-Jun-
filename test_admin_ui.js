function checkAdminPw() {
    const pw = document.getElementById('admin-pw').value;
    db.ref("admins/ryanl82").once('value', (s) => {
        if (s.val() && pw === s.val().pw) {
            document.getElementById('admin-login-view').style.display = 'none';
            document.getElementById('admin-dashboard-view').style.display = 'block';
            loadApprovalRequests();
        } else {
            myAlert("비밀번호가 올바르지 않습니다.");
        }
    });
}

function loadApprovalRequests() {
    db.ref("승인대기방").on('value', (snapshot) => {
        const list = document.getElementById('admin-list-content');
        list.innerHTML = '';
        const data = snapshot.val();
        if (!data) return list.innerHTML = "<div style='color:white; padding:20px;'>대기 중인 기사가 없습니다.</div>";
        Object.keys(data).forEach(key => {
            const u = data[key];
            const card = document.createElement('div');
            card.style.cssText = "background:rgba(255,255,255,0.1); padding:15px; border-radius:12px; margin-bottom:12px; border-left:5px solid #ff8c00;";
            card.innerHTML = `
                <div style="color:#ff8c00; font-weight:bold;">👤 ID: ${u.id}</div>
                <div style="color:#eee; font-size:14px; margin:5px 0;">${u.name} / ${u.company} (${u.camp})</div>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button onclick="approveUser('${u.id}','${u.name}','${u.company}','${u.camp}')" style="flex:1; padding:10px; background:#2ecc71; color:white; border:none; border-radius:8px; font-weight:bold;">승인</button>
                    <button onclick="rejectUser('${u.id}')" style="flex:1; padding:10px; background:#e74c3c; color:white; border:none; border-radius:8px; font-weight:bold;">거절</button>
                </div>`;
            list.appendChild(card);
        });
    });
}

function approveUser(id, name, company, camp) {
    if(!confirm(id + " 기사님을 승인하시겠습니까?")) return;
    db.ref("users/" + id).set({ id, name, company, camp, approved: true, regDate: new Date().getTime() })
    .then(() => db.ref("승인대기방/" + id).remove())
    .then(() => myAlert(id + " 승인 완료!"));
}

function rejectUser(id) {
    if(!confirm(id + " 기사님을 거절하시겠습니까?")) return;
    db.ref("승인대기방/" + id).remove().then(() => myAlert("삭제 완료!"));
}
