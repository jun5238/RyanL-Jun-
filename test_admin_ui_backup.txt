function myConfirm(message, onConfirm, okColor) {
    if (!okColor) okColor = "#ff8c00";
    const modal = document.createElement('div');
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;";

    const box = document.createElement('div');
    box.style = "background:#fff;width:80%;max-width:300px;border-radius:15px;padding:25px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);";

    const text = document.createElement('div');
    text.innerText = message;
    text.style = "font-size:15px;font-weight:bold;color:#333;line-height:1.5;margin-bottom:20px;";

    const btnGroup = document.createElement('div');
    btnGroup.style = "display:flex;gap:10px;";

    const okBtn = document.createElement('button');
    okBtn.innerText = "확인";
    okBtn.style = "width:50%;padding:12px;background:" + okColor + ";color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;";

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = "취소";
    cancelBtn.style = "width:50%;padding:12px;background:#ccc;color:#333;border:none;border-radius:10px;font-weight:bold;cursor:pointer;";

    okBtn.onclick = () => {
        document.body.removeChild(modal);
        if (onConfirm) onConfirm();
    };

    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };

    btnGroup.appendChild(okBtn);
    btnGroup.appendChild(cancelBtn);
    box.appendChild(text);
    box.appendChild(btnGroup);
    modal.appendChild(box);
    document.body.appendChild(modal);
}

function myPrompt(message, onSubmit) {
    const modal = document.createElement('div');
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;";

    const box = document.createElement('div');
    box.style = "background:#fff;width:80%;max-width:300px;border-radius:15px;padding:25px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);";

    const text = document.createElement('div');
    text.innerText = message;
    text.style = "font-size:15px;font-weight:bold;color:#333;line-height:1.5;margin-bottom:15px;";

    const input = document.createElement('input');
    input.type = "text";
    input.placeholder = "거절 사유를 입력해주세요";
    input.style = "width:100%;padding:12px;margin-bottom:20px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;";

    const btnGroup = document.createElement('div');
    btnGroup.style = "display:flex;gap:10px;";

    const okBtn = document.createElement('button');
    okBtn.innerText = "사유 등록";
    okBtn.style = "width:50%;padding:12px;background:#e74c3c;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;";

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = "취소";
    cancelBtn.style = "width:50%;padding:12px;background:#ccc;color:#333;border:none;border-radius:10px;font-weight:bold;cursor:pointer;";

    okBtn.onclick = () => {
        const val = input.value.trim();
        if(!val) { myAlert("사유를 입력해야 거절 처리가 가능합니다!"); return; }
        document.body.removeChild(modal);
        if(onSubmit) onSubmit(val);
    };

    cancelBtn.onclick = () => {
        document.body.removeChild(modal);
    };

    btnGroup.appendChild(okBtn);
    btnGroup.appendChild(cancelBtn);
    box.appendChild(text);
    box.appendChild(input);
    box.appendChild(btnGroup);
    modal.appendChild(box);
    document.body.appendChild(modal);
}

function checkAdminPw() {
    const pwInput = document.getElementById('admin-pw').value;
    const adminId = 'ryanl82';
    
    db.ref("admins/" + adminId).once('value', (snapshot) => {
        const adminData = snapshot.val();
        if (adminData && pwInput === adminData.pw) {
            document.getElementById('admin-login-view').style.display = 'none';
            document.getElementById('admin-dashboard-view').style.display = 'block';
            loadApprovalRequests(); 
        } else {
            myAlert("인증 정보가 올바르지 않습니다.");
            document.getElementById('admin-pw').value = '';
        }
    });
}

function loadApprovalRequests() {
    const listContent = document.getElementById('admin-list-content');
    listContent.innerHTML = `
        <div id="pending-section"></div>
        <div id="approved-section" style="margin-top:20px;"></div>
    `;

    db.ref("승인대기방").on('value', (snapshot) => {
        const pendingSec = document.getElementById('pending-section');
        if (!pendingSec) return;
        
        pendingSec.innerHTML = '<div style="color:#ff8c00; font-weight:bold; font-size:16px; margin-bottom:10px; text-align:left;">⏳ 대기 중인 신청건</div>';
        const data = snapshot.val();

        if (!data) {
            pendingSec.innerHTML += '<div style="color:#ccc; padding:10px; text-align:center;">대기 중인 신청건이 없습니다.</div>';
        } else {
            Object.keys(data).forEach(key => {
                const request = data[key];
                const card = document.createElement('div');
                card.style.cssText = "background:rgba(255,255,255,0.1); border-radius:12px; padding:15px; margin-bottom:12px; text-align:left; border-left:5px solid #ff8c00;";
                
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                        <div style="color:#ff8c00; font-weight:900; font-size:16px;">👤 ID: ${request.id}</div>
                        <div style="background:#ff8c00; color:white; font-size:10px; padding:2px 6px; border-radius:4px;">대기중</div>
                    </div>
                    <div style="color:#eee; font-size:14px; margin-bottom:4px;"><b>성함:</b> ${request.name}</div>
                    <div style="color:#eee; font-size:14px; margin-bottom:4px;"><b>업체:</b> ${request.company}</div>
                    <div style="color:#aaa; font-size:12px;"><b>캠프:</b> ${request.camp}</div>
                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button onclick="approveUser('${request.id}', '${request.name}', '${request.company}', '${request.camp}')" style="flex:1.2; padding:12px; background:#2ecc71; color:white; border:none; border-radius:8px; font-weight:900; cursor:pointer;">최종 승인</button>
                        <button onclick="rejectUser('${request.id}')" style="flex:0.8; padding:12px; background:#e74c3c; color:white; border:none; border-radius:8px; font-weight:900; cursor:pointer;">거절</button>
                    </div>
                `;
                pendingSec.appendChild(card);
            });
        }
    });

    db.ref("users").on('value', (snapshot) => {
        const appSec = document.getElementById('approved-section');
        if (!appSec) return;
        
        appSec.innerHTML = '<div style="color:#2ecc71; font-weight:bold; font-size:16px; margin-bottom:10px; text-align:left; border-top:1px dashed rgba(255,255,255,0.2); padding-top:15px;">✅ 업체별 승인 완료 명단</div>';
        const data = snapshot.val();

        if (!data) {
            appSec.innerHTML += '<div style="color:#ccc; padding:10px; text-align:center;">등록된 기사님이 없습니다.</div>';
        } else {
            const grouped = {};
            Object.keys(data).forEach(key => {
                const user = data[key];
                if (user.approved) {
                    const comp = user.company || '기타';
                    if (!grouped[comp]) grouped[comp] = [];
                    grouped[comp].push(user);
                }
            });

            if (Object.keys(grouped).length === 0) {
                appSec.innerHTML += '<div style="color:#ccc; padding:10px; text-align:center;">등록된 기사님이 없습니다.</div>';
                return;
            }

            for (const comp in grouped) {
                const compDiv = document.createElement('div');
                compDiv.style.cssText = "background:rgba(255,255,255,0.05); border-radius:8px; padding:12px; margin-bottom:10px; text-align:left;";
                compDiv.innerHTML = `<div style="color:#f1c40f; font-weight:bold; font-size:15px; margin-bottom:10px;">🏢 ${comp} <span style="font-size:12px; color:#aaa;">(${grouped[comp].length}명)</span></div>`;
                
                grouped[comp].forEach(u => {
                    compDiv.innerHTML += `
                        <div style="display:flex; justify-content:space-between; align-items:center; color:#eee; font-size:13px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                            <div><strong style="color:white;">${u.name}</strong> <span style="color:#aaa;">(${u.id})</span></div>
                            <div style="color:#aaa; font-size:11px;">${u.camp}</div>
                        </div>
                    `;
                });
                appSec.appendChild(compDiv);
            }
        }
    });
}

function approveUser(id, name, company, camp) {
    myConfirm(id + " 기사님을 승인하시겠습니까?", () => {
        db.ref("users/" + id).set({
            id: id, name: name, company: company, camp: camp, approved: true, regDate: new Date().getTime()
        })
        .then(() => db.ref("승인대기방/" + id).remove())
        .then(() => db.ref("승인거절방/" + id).remove()) 
        .then(() => myAlert(id + " 기사님 승인 완료!"))
        .catch(() => myAlert("승인 중 오류 발생"));
    }, "#2ecc71");
}

function rejectUser(id) {
    myPrompt(id + " 기사님의 거절 사유를 입력해주세요.", (reason) => {
        db.ref("승인거절방/" + id).set({
            id: id,
            reason: reason,
            timestamp: new Date().getTime()
        })
        .then(() => db.ref("승인대기방/" + id).remove())
        .then(() => myAlert("거절 처리 및 사유가 전송되었습니다!"))
        .catch(() => myAlert("처리 중 오류가 발생했습니다."));
    });
}

function cancelAdmin() { showSetup(); }
function closeAdmin() { showSetup(); }
