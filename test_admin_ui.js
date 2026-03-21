let globalUsersData = {}; 

function myConfirm(message, onConfirm, okColor) {
    if (!okColor) okColor = "#ff8c00";
    const modal = document.createElement('div');
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;";

    const box = document.createElement('div');
    box.style = "background:#fff;width:80%;max-width:300px;border-radius:15px;padding:25px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);";

    const text = document.createElement('div');
    text.innerText = message;
    text.style = "font-size:15px;font-weight:bold;color:#333;line-height:1.5;margin-bottom:20px;white-space:pre-wrap;";

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
    input.placeholder = "사유를 입력해주세요";
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
        if(!val) { myAlert("사유를 입력해야 처리가 가능합니다!"); return; }
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
            loadTodayStats();
            document.getElementById('stat-start-date').value = getTodayDateString();
            document.getElementById('stat-end-date').value = getTodayDateString();
        } else {
            myAlert("인증 정보가 올바르지 않습니다.");
            document.getElementById('admin-pw').value = '';
        }
    });
}

function toggleStatsSection(contentId, headerEl) {
    const contentEl = document.getElementById(contentId);
    const iconEl = headerEl.querySelector('.toggle-icon');

    if (contentEl.style.display === 'none') {
        contentEl.style.display = 'block';
        iconEl.innerText = '▲ 접기';
    } else {
        contentEl.style.display = 'none';
        iconEl.innerText = '▼ 펴기';
    }
}

function searchStats() {
    const start = document.getElementById('stat-start-date').value;
    const end = document.getElementById('stat-end-date').value;
    
    if(!start || !end) { myAlert("시작일과 종료일을 모두 선택해주세요!"); return; }
    if(start > end) { myAlert("시작일이 종료일보다 늦을 수 없습니다!"); return; }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

    db.ref("통계").orderByKey().startAt(start).endAt(end).once('value', snapshot => {
        const data = snapshot.val();
        let totalReqs = 0;
        let uniqueUsers = new Set();
        let totalDau = 0; 

        if(data) {
            Object.keys(data).forEach(dateKey => {
                const dayData = data[dateKey];
                if(dayData.채번건수) totalReqs += dayData.채번건수;
                if(dayData.접속자) {
                    const dauCount = Object.keys(dayData.접속자).length;
                    totalDau += dauCount; 
                    Object.keys(dayData.접속자).forEach(uid => uniqueUsers.add(uid));
                }
            });
        }

        const avgUsers = diffDays > 0 ? (uniqueUsers.size / diffDays).toFixed(1) : "0.0";
        const avgReqs = diffDays > 0 ? (totalReqs / diffDays).toFixed(1) : "0.0";

        document.getElementById('search-total-users').innerText = uniqueUsers.size;
        document.getElementById('search-total-reqs').innerText = totalReqs;
        
        document.getElementById('search-avg-users').innerText = avgUsers;
        document.getElementById('search-avg-reqs').innerText = avgReqs;

        document.getElementById('stat-search-result').style.display = 'block';
    });
}

function loadTodayStats() {
    const today = getTodayDateString();
    document.getElementById('stat-date-display').innerText = today;
    
    db.ref(`통계/${today}`).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const dauCount = data.접속자 ? Object.keys(data.접속자).length : 0;
            const reqCount = data.채번건수 ? data.채번건수 : 0;
            
            document.getElementById('stat-dau').innerText = dauCount;
            document.getElementById('stat-reqs').innerText = reqCount;
        } else {
            document.getElementById('stat-dau').innerText = 0;
            document.getElementById('stat-reqs').innerText = 0;
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
                    <div style="color:#eee; font-size:14px; margin-bottom:4px;"><b>연락처:</b> ${request.phone || '미입력'}</div>
                    <div style="color:#eee; font-size:14px; margin-bottom:4px;"><b>업체:</b> ${request.company}</div>
                    <div style="color:#aaa; font-size:12px;"><b>캠프:</b> ${request.camp}</div>
                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button onclick="approveUser('${request.id}', '${request.name}', '${request.company}', '${request.camp}', '${request.phone || ''}')" style="flex:1.2; padding:12px; background:#2ecc71; color:white; border:none; border-radius:8px; font-weight:900; cursor:pointer;">최종 승인</button>
                        <button onclick="rejectUser('${request.id}', '${request.phone || ''}')" style="flex:0.8; padding:12px; background:#e74c3c; color:white; border:none; border-radius:8px; font-weight:900; cursor:pointer;">거절</button>
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
            const comp = String(user.company || '기타');
            const name = String(user.name || '');
            const uid = String(user.id || ''); 
            
            if (name.toLowerCase().includes(keyword) || uid.toLowerCase().includes(keyword)) {
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

    let compIndex = 0;
    for (const comp in grouped) {
        compIndex++;
        const compDiv = document.createElement('div');
        compDiv.style.cssText = "background:rgba(255,255,255,0.05); border-radius:8px; padding:12px; margin-bottom:10px; text-align:left;";
        
        const displayStyle = keyword ? "block" : "none";
        const iconText = keyword ? "▲ 접기" : "▼ 펴기";

        let htmlStr = `
            <div onclick="toggleCompanyList('comp-list-${compIndex}', this)" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; color:#f1c40f; font-weight:bold; font-size:15px; padding:5px 0;">
                <div>🏢 ${comp} <span style="font-size:12px; color:#aaa;">(${grouped[comp].length}명)</span></div>
                <div class="toggle-icon" style="color:#aaa; font-size:11px; padding:4px 8px; background:rgba(255,255,255,0.1); border-radius:5px;">${iconText}</div>
            </div>
            <div id="comp-list-${compIndex}" style="display:${displayStyle}; margin-top:10px; transition:all 0.3s ease;">
        `;
        
        grouped[comp].forEach(u => {
            const isSuspended = u.suspended === true;
            const suspendBtnColor = isSuspended ? "#95a5a6" : "#2ecc71";
            const suspendAction = isSuspended 
                ? `unsuspendUser('${u.id}', '${u.name}', '${u.suspendReason || '사유 없음'}')` 
                : `suspendUser('${u.id}', '${u.name}')`;

            htmlStr += `
                <div style="display:flex; justify-content:space-between; align-items:center; color:#eee; font-size:13px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex; flex-direction:column; gap:5px;">
                        <div><strong style="color:${isSuspended ? '#888' : 'white'}; font-size:14px;">${u.name}</strong> <span style="color:#aaa;">(${u.id})</span></div>
                        <div style="color:${isSuspended ? '#888' : '#3498db'}; font-size:12px; font-weight:bold;">📞 ${u.phone || '미입력'}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="color:#aaa; font-size:11px;">${u.camp}</div>
                        <button onclick="editUserInfo('${u.id}', '${u.name}', '${u.company}', '${u.camp}', '${u.phone || ''}')" style="padding:5px 8px; background:#3498db; color:white; border:none; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.2);">수정</button>
                        <button onclick="deleteUser('${u.id}', '${u.name}')" style="padding:5px 8px; background:#e74c3c; color:white; border:none; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.2);">탈퇴</button>
                        <button onclick="${suspendAction}" style="padding:5px 8px; background:${suspendBtnColor}; color:white; border:none; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.2);">정지</button>
                    </div>
                </div>
            `;
        });
        
        htmlStr += `</div>`; 
        compDiv.innerHTML = htmlStr;
        appSec.appendChild(compDiv);
    }
}

function suspendUser(id, name) {
    myPrompt(name + " 기사님의 계정을 정지하려는 사유를 입력하세요.", (reason) => {
        db.ref("users/" + id).update({
            suspended: true,
            suspendReason: reason
        }).then(() => {
            myAlert(name + " 기사님의 계정이 정지되었습니다.");
        }).catch(() => myAlert("오류가 발생했습니다."));
    });
}

function unsuspendUser(id, name, reason) {
    myConfirm(`[과거 정지 사유]\n${reason}\n\n${name} 기사님의 정지를 해제하시겠습니까?`, () => {
        db.ref("users/" + id).update({
            suspended: null,
            suspendReason: null
        }).then(() => {
            myAlert(name + " 기사님 계정 정지가 해제되었습니다.");
        }).catch(() => myAlert("오류가 발생했습니다."));
    }, "#2ecc71");
}

function toggleCompanyList(listId, headerEl) {
    const listEl = document.getElementById(listId);
    const iconEl = headerEl.querySelector('.toggle-icon');

    if (listEl.style.display === 'none') {
        listEl.style.display = 'block';
        iconEl.innerText = '▲ 접기';
    } else {
        listEl.style.display = 'none';
        iconEl.innerText = '▼ 펴기';
    }
}

function deleteUser(id, name) {
    myConfirm(name + " 기사님을 정말 강제 탈퇴시키겠습니까?", () => {
        db.ref("users/" + id).remove()
        .then(() => myAlert(name + " 기사님이 탈퇴 처리되었습니다."))
        .catch(() => myAlert("오류가 발생했습니다."));
    }, "#e74c3c");
}

function editUserInfo(id, oldName, oldComp, oldCamp, oldPhone) {
    const modal = document.createElement('div');
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:999999;";

    const box = document.createElement('div');
    box.style = "background:#fff;width:85%;max-width:320px;border-radius:15px;padding:25px;text-align:left;box-shadow:0 10px 30px rgba(0,0,0,0.4);";

    box.innerHTML = `
        <div style="font-size:18px;font-weight:900;color:#152b52;margin-bottom:20px;text-align:center;">✏️ 기사님 정보 수정</div>
        
        <label style="font-size:12px; font-weight:bold; color:#555; display:block; margin-bottom:5px;">👤 성함</label>
        <input type="text" id="edit-name" value="${oldName}" style="width:100%;padding:12px;margin-bottom:15px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;font-family:inherit;">
        
        <label style="font-size:12px; font-weight:bold; color:#555; display:block; margin-bottom:5px;">📞 연락처</label>
        <input type="tel" id="edit-phone" oninput="formatPhoneNumber(this)" maxlength="13" value="${oldPhone === 'undefined' ? '' : oldPhone}" style="width:100%;padding:12px;margin-bottom:15px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;font-family:inherit;">
        
        <label style="font-size:12px; font-weight:bold; color:#555; display:block; margin-bottom:5px;">🏢 업체명</label>
        <input type="text" id="edit-comp" value="${oldComp}" style="width:100%;padding:12px;margin-bottom:15px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;font-family:inherit;">
        
        <label style="font-size:12px; font-weight:bold; color:#555; display:block; margin-bottom:5px;">📍 소속 캠프</label>
        <select id="edit-camp" style="width:100%;padding:12px;margin-bottom:25px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;font-family:inherit;">
            <option value="음봉MB" ${oldCamp === '음봉MB' ? 'selected' : ''}>음봉MB</option>
            <option value="송촌MB" ${oldCamp === '송촌MB' ? 'selected' : ''}>송촌MB</option>
        </select>
        
        <div style="display:flex;gap:10px;">
            <button id="btn-save-edit" style="width:50%;padding:14px;background:#3498db;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;">저장</button>
            <button id="btn-cancel-edit" style="width:50%;padding:14px;background:#ccc;color:#333;border:none;border-radius:10px;font-size:15px;font-weight:bold;cursor:pointer;">취소</button>
        </div>
    `;

    modal.appendChild(box);
    document.body.appendChild(modal);

    document.getElementById('btn-save-edit').onclick = () => {
        const nName = document.getElementById('edit-name').value.trim();
        const nPhone = document.getElementById('edit-phone').value.trim();
        const nComp = document.getElementById('edit-comp').value.trim();
        const nCamp = document.getElementById('edit-camp').value;

        if(!nName || !nComp) { myAlert("성함과 업체명을 모두 비워둘 수 없습니다!"); return; }

        db.ref("users/" + id).update({
            name: nName,
            phone: nPhone,
            company: nComp,
            camp: nCamp
        }).then(() => {
            document.body.removeChild(modal);
            myAlert("✨ 정보가 깔끔하게 수정되었습니다!");
        }).catch(() => myAlert("수정 중 오류가 발생했습니다."));
    };

    document.getElementById('btn-cancel-edit').onclick = () => {
        document.body.removeChild(modal);
    };
}

function downloadExcel() {
    if(Object.keys(globalUsersData).length === 0) {
        myAlert("다운로드할 데이터가 없습니다."); return;
    }
    
    let csv = '\uFEFF'; 
    csv += "아이디,성함,연락처,업체명,캠프,가입일시\n";
    
    Object.keys(globalUsersData).forEach(key => {
        const u = globalUsersData[key];
        if(u.approved) {
            const dateStr = u.regDate ? new Date(u.regDate).toLocaleString() : '정보없음';
            csv += `${u.id},${u.name},${u.phone || '미입력'},${u.company},${u.camp},${dateStr}\n`;
        }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "라이언엘_기사명단.csv";
    link.click();
}

function approveUser(id, name, company, camp, phone) {
    myConfirm(id + " 기사님을 승인하시겠습니까?", () => {
        db.ref("users/" + id).set({
            id: id, name: name, company: company, camp: camp, phone: phone || '', approved: true, regDate: new Date().getTime()
        })
        .then(() => db.ref("승인대기방/" + id).remove())
        .then(() => db.ref("승인거절방/" + id).remove()) 
        .then(() => {
            myAlert(id + " 기사님 승인 완료!");
            if (phone) {
                const msg = "천안1캠프 채번 시스템 가입이 승인되었습니다.\n처음 로그인 후 [👆 붙여넣기 클릭] 버튼을 눌러 권한을 [허용] 해주세요.";
                sendSMS(phone, msg);
            }
        })
        .catch(() => myAlert("승인 중 오류 발생"));
    }, "#2ecc71");
}

function rejectUser(id, phone) {
    myPrompt(id + " 기사님의 거절 사유를 입력해주세요.", (reason) => {
        db.ref("승인거절방/" + id).set({
            id: id,
            reason: reason,
            timestamp: new Date().getTime()
        })
        .then(() => db.ref("승인대기방/" + id).remove())
        .then(() => {
            myAlert("거절 처리 및 사유가 전송되었습니다!");
            if (phone) {
                const msg = "천안1캠프 채번 시스템 가입이 거절되었습니다.\n앱에 접속하여 거절 사유를 확인해주세요.";
                sendSMS(phone, msg);
            }
        })
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

function sendSMS(phone, msg) {
    if (!phone) return;
    const encodedMsg = encodeURIComponent(msg);
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) {
        window.location.href = "sms:" + phone + "&body=" + encodedMsg;
    } else {
        window.location.href = "sms:" + phone + "?body=" + encodedMsg;
    }
}

function saveNotice() {
    const input = document.getElementById('admin-notice-input');
    const text = input.value.trim();
    if(!text) { myAlert("공지 내용을 입력해주세요!"); return; }
    
    db.ref("공지사항").set({ text: text });
    
    db.ref("공지사항내역").push({
        text: text,
        time: new Date().getTime()
    }).then(() => {
        input.value = '';
        myAlert("공지사항이 성공적으로 저장되었습니다!");
        loadNoticeHistory();
    });
}

function loadNoticeHistory() {
    const listObj = document.getElementById('notice-history-list');
    if(!listObj) return;
    
    db.ref("공지사항내역").orderByChild("time").limitToLast(5).once('value', snap => {
        let html = '';
        const notices = [];
        snap.forEach(child => { notices.unshift(child.val()); });
        
        if(notices.length === 0) {
            html = '<div style="color:#999;">최근 등록된 공지가 없습니다.</div>';
        } else {
            notices.forEach(n => {
                const d = new Date(n.time);
                const timeStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
                html += `<div style="padding: 5px 0; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                    <span style="color:#f1c40f; margin-right:5px;">[${timeStr}]</span> 
                    <span style="color:#fff;">${n.text}</span>
                </div>`;
            });
        }
        listObj.innerHTML = html;
    });
}

const adminObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'admin-dashboard-view' && mutation.target.style.display !== 'none') {
            loadNoticeHistory();
        }
    });
});

window.addEventListener('load', () => {
    const adminView = document.getElementById('admin-dashboard-view');
    if(adminView) adminObserver.observe(adminView, { attributes: true, attributeFilter: ['style'] });
});
