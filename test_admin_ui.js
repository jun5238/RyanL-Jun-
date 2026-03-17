function checkAdminPw() {
    const pw = document.getElementById('admin-pw').value;
    const userIdInput = document.getElementById('user-id').value.trim();

    // 관리자 마스터 아이디(ryanl82)는 비번 없이도 프리패스!
    if (userIdInput === "ryanl82" || pw === "0000") {
        document.getElementById('admin-login-view').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        loadApprovalRequests();
    } else {
        alert("비밀번호가 틀렸습니다.");
    }
}

function loadApprovalRequests() {
    const listContent = document.getElementById('admin-list-content');
    listContent.innerHTML = '<div style="color:white; padding:20px;">대기 명단 불러오는 중...</div>';

    db.ref("승인대기방").on('value', (snapshot) => {
        listContent.innerHTML = '';
        const data = snapshot.val();

        if (!data) {
            listContent.innerHTML = '<div style="color:#ccc; padding:20px;">현재 승인 대기 중인 기사가 없습니다.</div>';
            return;
        }

        Object.keys(data).forEach(key => {
            const request = data[key];
            const card = document.createElement('div');
            card.style.cssText = "background:rgba(255,255,255,0.1); border-radius:12px; padding:15px; margin-bottom:12px; text-align:left; border-left:5px solid #ff8c00; box-shadow:0 4px 10px rgba(0,0,0,0.2);";
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                    <div style="color:#ff8c00; font-weight:900; font-size:16px;">👤 ID: ${request.id}</div>
                    <div style="background:#ff8c00; color:white; font-size:10px; padding:2px 6px; border-radius:4px;">대기중</div>
                </div>
                <div style="color:#eee; font-size:14px; margin-bottom:4px;"><b>성함:</b> ${request.name}</div>
                <div style="color:#eee; font-size:14px; margin-bottom:4px;"><b>업체:</b> ${request.company}</div>
                <div style="color:#aaa; font-size:12px;"><b>캠프:</b> ${request.camp}</div>
                
                <div style="display:flex; gap:8px; margin-top:12px;">
                    <button onclick="approveUser('${request.id}', '${request.name}', '${request.company}', '${request.camp}')" style="flex:1.2; padding:10px; background:#2ecc71; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">최종 승인</button>
                    <button onclick="rejectUser('${request.id}')" style="flex:0.8; padding:10px; background:#e74c3c; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">거절</button>
                </div>
            `;
            listContent.appendChild(card);
        });
    });
}

function approveUser(id, name, company, camp) {
    if(confirm(id + " 기사님을 최종 승인하시겠습니까?")) {
        db.ref("users/" + id).set({
            id: id,
            name: name,
            company: company,
            camp: camp,
            approved: true,
            regDate: new Date().getTime()
        })
        .then(() => {
            return db.ref("승인대기방/" + id).remove();
        })
        .then(() => {
            alert(id + " 승인 완료! 이제 즉시 이용 가능합니다.");
        })
        .catch((error) => {
            alert("오류 발생: " + error.message);
        });
    }
}

function rejectUser(id) {
    if(confirm("이 신청건을 삭제하시겠습니까?")) {
        db.ref("승인대기방/" + id).remove()
        .then(() => alert("삭제 완료!"))
        .catch(() => alert("오류 발생"));
    }
}

function cancelAdmin() {
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('setup-view').style.display = 'block';
}

function closeAdmin() {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('setup-view').style.display = 'block';
}
