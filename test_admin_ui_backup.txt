let globalUsersData = {}; 

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
        <div id="feedback-section" style="margin-top:20px;"></div>
    `;

    db.ref("공지사항").once('value', snap => {
        const val = snap.val();
        if(val && val.text) document.getElementById('admin-notice-input').value = val.text;
        else document.getElementById('admin-notice-input').value = '';
    });

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
        globalUsersData = snapshot.val() || {}; 
        renderApprovedList(); 
    });

    db.ref("피드백방").on('value', (snapshot) => {
        const feedSec = document.getElementById('feedback-section');
        if (!feedSec) return;

        feedSec.innerHTML = '<div style="color:#9b59b6; font-weight:bold; font-size:16px; margin-bottom:10px; text-align:left; border-top:1px dashed rgba(255,255,255,0.2); padding-top:15px;">💡 도착한 피드백</div>';
        const data = snapshot.val();

        if (!data) {
            feedSec.innerHTML += '<div style="color:#ccc; padding:10px; text-align:center;">도착한 피드백이 없습니다.</div>';
        } else {
            Object.keys(data).forEach(key => {
                const fb = data[key];
                const card = document.createElement('div');
                card.style.cssText = "background:rgba(255,255,255,0.05); border-radius:8px; padding:15px; margin-bottom:10px; text-align:left; border-left:5px solid #9b59b6;";
                card.innerHTML = `
                    <div style="color:#f1c40f; font-size:12px; margin-bottom:5px; font-weight:bold;">보낸 기사님: ${fb.id}</div>
                    <div style="color:#eee; font-size:14px; line-height:1.5; margin-bottom:10px;">${fb.text}</div>
                    <button onclick="deleteFeedback('${key}')" style="padding:8px 15px; background:#e74c3c; color:white; border:none; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer;">확인 및 삭제</button>
                `;
                feedSec.appendChild(card);
            });
        }
    });
}

function renderApprovedList() {
    const appSec = document.getElementById('approved-section');
    if (!appSec) return;
    
    appSec.innerHTML = '<div style="color:#2ecc71; font-weight:bold; font-size:16px; margin-bottom:10px; text-align:left; border-top:1px dashed rgba(255,255,255,0.2); padding-top:15px;">✅ 업체별 승인 완료 명단</div>';
    
    const searchInput = document.getElementById('admin-search-input');
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const grouped = {};
    let count = 0;

    Object.keys(globalUsersData).forEach(key => {
        const user = globalUsersData[key];
        if (user.approved) {
            // 숫자가 들어와도 절대 파업하지 않도록 String()으로 꽁꽁 묶어줬습니다!
            const comp = String(user.company || '기타');
            const name = String(user.name || '');
            const uid = String(user.id || ''); 
            
            // 이름, 업체명, 아이디 중 하나라도 일치하면 검색 완료!
            if (comp.toLowerCase().includes(keyword) || 
                name.toLowerCase().includes(keyword) || 
                uid.toLowerCase().includes(keyword)) {
                
                if (!grouped[comp]) grouped[comp] = [];
                grouped[comp].push(user);
                count++;
            }
        }
    });

    if (count === 0) {
        appSec.innerHTML += '<div style="color:#ccc; padding:10px; text-align:center;">검색 결과가 없습니다.</div>';
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

function saveNotice() {
    const txt = document.getElementById('admin-notice-input').value.trim();
    db.ref("공지사항").set({ text: txt })
    .then(() => {
        if(txt === '') myAlert("공지사항이 삭제되었습니다!");
        else myAlert("공지사항이 성공적으로 등록되었습니다!");
    })
    .catch(() => myAlert("오류가 발생했습니다."));
}

function downloadExcel() {
    if(Object.keys(globalUsersData).length === 0) {
        myAlert("다운로드할 데이터가 없습니다."); return;
    }
    
    let csv = '\uFEFF'; 
    csv += "아이디,성함,업체명,캠프,가입일시\n";
    
    Object.keys(globalUsersData).forEach(key => {
        const u = globalUsersData[key];
        if(u.approved) {
            const dateStr = u.regDate ? new Date(u.regDate).toLocaleString() : '정보없음';
            csv += `${u.id},${u.name},${u.company},${u.camp},${dateStr}\n`;
        }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "라이언엘_기사명단.csv";
    link.click();
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

function deleteFeedback(key) {
    myConfirm("이 피드백을 삭제하시겠습니까?", () => {
        db.ref("피드백방/" + key).remove()
        .then(() => myAlert("피드백이 삭제되었습니다."))
        .catch(() => myAlert("삭제 실패"));
    }, "#e74c3c");
}

function cancelAdmin() { showSetup(); }
function closeAdmin() { showSetup(); }
