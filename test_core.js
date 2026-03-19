window.onload = function() {
    setTimeout(function() {
        document.getElementById('splash-screen').style.display = 'none';
    }, 1500);

    const isDark = localStorage.getItem('ryanl_darkmode') === 'on';
    if(isDark) {
        document.body.classList.add('dark-mode');
    }
    
    setupNetworkMonitor();

    const savedId = localStorage.getItem('ryanl_id');
    const savedCamp = localStorage.getItem('ryanl_camp');

    if (savedId && savedCamp) {
        if (savedId === 'ryanl82') {
             showSetup(); 
        } else {
            db.ref("users/" + savedId).once('value', (snapshot) => {
                const userData = snapshot.val();
                if (userData && userData.approved === true) {
                    showMain(savedId, savedCamp);
                } else {
                    showSetup();
                }
            });
        }
    } else {
        showSetup();
    }
    
    setTimeout(() => { updateDarkModeButton(isDark); }, 100);
};

function setupNetworkMonitor() {
    const alertBar = document.createElement('div');
    alertBar.id = "network-alert";
    alertBar.style = "position:fixed; top:0; left:0; width:100%; padding:12px 0; text-align:center; font-weight:bold; font-size:14px; color:white; z-index:9999999; display:none; transition: all 0.3s ease;";
    document.body.appendChild(alertBar);

    window.addEventListener('offline', () => {
        alertBar.style.backgroundColor = "#e74c3c";
        alertBar.innerHTML = "📡 현재 인터넷 연결이 끊겼습니다! 지상에서 전송해주세요.";
        alertBar.style.display = "block";
        
        const btn = document.getElementById('submitBtn');
        if(btn) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.innerText = "인터넷 연결 대기중...";
        }
    });

    window.addEventListener('online', () => {
        alertBar.style.backgroundColor = "#2ecc71";
        alertBar.innerHTML = "✅ 인터넷 연결이 복구되었습니다!";
        
        setTimeout(() => {
            alertBar.style.display = "none";
        }, 3000);
        
        const btn = document.getElementById('submitBtn');
        if(btn) {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.innerText = "바로 제출하기";
        }
    });
}

function playSuccessSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(800, ctx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1); 
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); 
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch(e) {}
}

function handleFormSuccess() {
    window.isSubmitted = false;
    playSuccessSound();
    
    const waybill = document.getElementById('waybill').value;
    const qty = document.getElementById('quantity').value;
    
    saveHistory(waybill, qty);
    
    document.getElementById('success-overlay').style.display = 'flex';
    document.getElementById('waybill').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('submitBtn').innerText = '바로 제출하기';
}

function saveHistory(waybill, qty) {
    if(!waybill) return;
    const id = localStorage.getItem('ryanl_id') || 'unknown';
    let history = JSON.parse(localStorage.getItem('ryanl_history_' + id) || '[]');
    
    history.unshift({ 
        time: new Date().getTime(),
        waybill: waybill,
        qty: qty
    });
    
    if(history.length > 20) history.pop(); 
    localStorage.setItem('ryanl_history_' + id, JSON.stringify(history));
}

function showHistory() {
    const id = localStorage.getItem('ryanl_id') || 'unknown';
    let history = JSON.parse(localStorage.getItem('ryanl_history_' + id) || '[]');
    let html = '<div style="font-size:18px;font-weight:900;margin-bottom:15px; color:#152b52;">📋 내 채번 기록 <span style="font-size:12px; color:#777;">(최근 20건)</span></div>';
    
    if(history.length === 0) {
        html += '<div style="color:#777; font-size:14px; margin-bottom:20px; padding:20px; background:#f4f4f4; border-radius:10px;">아직 채번 요청 기록이 없습니다!</div>';
    } else {
        html += '<div style="max-height:250px; overflow-y:auto; margin-bottom:15px; text-align:left; padding-right:5px;">';
        history.forEach(h => {
            const d = new Date(h.time);
            const timeStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
            html += `
                <div class="history-item" style="background:#f9f9f9; padding:12px; border-radius:8px; margin-bottom:8px; border-left:4px solid #3498db; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                    <div style="font-size:11px; color:#888; margin-bottom:4px;">⏱️ ${timeStr}</div>
                    <div class="history-waybill" style="font-size:14px; font-weight:bold; color:#333;">📦 ${h.waybill} <span style="color:#e74c3c;">(${h.qty}개)</span></div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    html += '<button onclick="document.getElementById(\'history-overlay\').style.display=\'none\'" style="width:100%; padding:12px; background:#152b52; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">닫기</button>';
    
    if(document.body.classList.contains('dark-mode')) {
        html = html.replace('color:#152b52;', 'color:#fff;').replace('color:#333;', 'color:#fff;');
    }
    
    document.getElementById('history-content').innerHTML = html;
    document.getElementById('history-overlay').style.display = 'flex';
}

function myAlert(msg) {
    document.getElementById('custom-alert-msg').innerText = msg;
    document.getElementById('custom-alert-box').style.display = 'flex';
}

function saveInfo() {
    const userId = document.getElementById('user-id').value.trim();
    const userCamp = document.getElementById('user-camp').value;

    if (!userId) { myAlert("아이디를 입력해주세요."); return; }

    if (userId === 'ryanl82') {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
        return;
    }

    if (!userCamp) { myAlert("캠프를 선택해주세요."); return; }

    db.ref("users/" + userId).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.approved === true) {
            localStorage.setItem('ryanl_id', userId);
            localStorage.setItem('ryanl_camp', userCamp);
            showMain(userId, userCamp);
        } else {
            db.ref("승인대기방/" + userId).once('value', (pendingSnap) => {
                if (pendingSnap.exists()) {
                    myAlert("⏳ 현재 관리자 승인 대기 중입니다!\n처리가 완료될 때까지 조금만 기다려주세요.");
                } else {
                    db.ref("승인거절방/" + userId).once('value', (rejectSnap) => {
                        const rejectData = rejectSnap.val();
                        if (rejectData) {
                            myAlert("❌ 승인이 반려되었습니다.\n\n사유: " + rejectData.reason + "\n\n정보를 수정하여 다시 신청해주세요!");
                        }
                        document.getElementById('custom-alert-overlay').style.display = 'flex';
                        document.getElementById('req-id').value = userId;
                    });
                }
            });
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

    db.ref("공지사항").once('value', snap => {
        const val = snap.val();
        if(val && val.text) {
            const savedNotice = localStorage.getItem('notice_' + id);
            
            if(savedNotice !== val.text) {
                myAlert("📢 [전체 공지사항]\n\n" + val.text);
                localStorage.setItem('notice_' + id, val.text); 
            }
        }
    });
}

function showSetup() {
    document.getElementById('main-view').style.display = 'none';
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('setup-view').style.display = 'block';
}

function toggleGuide() {
    const content = document.getElementById('guide-content');
    content.style.display = (content.style.display === 'block') ? 'none' : 'block';
}

function pasteClipboard() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('waybill').value = text;
    }).catch(err => { myAlert("권한이 필요합니다."); });
}

function sendFeedbackPrompt() {
    const modal = document.createElement('div');
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:999999;";

    const box = document.createElement('div');
    box.style = "background:#fff;width:80%;max-width:300px;border-radius:15px;padding:25px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);";

    const text = document.createElement('div');
    text.innerText = "💡 시스템 피드백 보내기";
    text.style = "font-size:16px;font-weight:900;color:#152b52;margin-bottom:15px;";

    const input = document.createElement('textarea');
    input.placeholder = "개선점이나 오류를 자유롭게 적어주세요!";
    input.style = "width:100%;height:100px;padding:12px;margin-bottom:20px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box;font-size:14px;resize:none;font-family:inherit;";

    const btnGroup = document.createElement('div');
    btnGroup.style = "display:flex;gap:10px;";

    const okBtn = document.createElement('button');
    okBtn.innerText = "전송하기";
    okBtn.style = "width:50%;padding:12px;background:#9b59b6;color:#fff;border:none;border-radius:10px;font-weight:900;cursor:pointer;";

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = "취소";
    cancelBtn.style = "width:50%;padding:12px;background:#ccc;color:#333;border:none;border-radius:10px;font-weight:bold;cursor:pointer;";

    okBtn.onclick = () => {
        const val = input.value.trim();
        if(!val) { myAlert("내용을 입력해주세요!"); return; }
        
        const userId = localStorage.getItem('ryanl_id') || '로그인 전 사용자';
        
        db.ref("피드백방").push({
            id: userId,
            text: val,
            timestamp: new Date().getTime()
        }).then(() => {
            document.body.removeChild(modal);
            myAlert("소중한 피드백이 전송되었습니다!\n더 나은 시스템을 위해 노력하겠습니다. 😊");
        }).catch(() => {
            myAlert("전송 중 오류가 발생했습니다.");
        });
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

const sunIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#f1c40f" stroke="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3" stroke="#f1c40f" stroke-width="1.5"></line><line x1="12" y1="21" x2="12" y2="23" stroke="#f1c40f" stroke-width="1.5"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#f1c40f" stroke-width="1.5"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#f1c40f" stroke-width="1.5"></line><line x1="1" y1="12" x2="3" y2="12" stroke="#f1c40f" stroke-width="1.5"></line><line x1="21" y1="12" x2="23" y2="12" stroke="#f1c40f" stroke-width="1.5"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#f1c40f" stroke-width="1.5"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#f1c40f" stroke-width="1.5"></line></svg>`;

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('ryanl_darkmode', isDark ? 'on' : 'off');
    updateDarkModeButton(isDark);
}

function updateDarkModeButton(isDark) {
    const btn = document.getElementById('dark-mode-btn');
    const logo = document.querySelector('.logo-img');

    if (btn) {
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.gap = '5px';
        btn.style.width = '100px';
        btn.style.padding = '6px';

        if (isDark) {
            btn.innerHTML = `${sunIconSvg} <span style="font-weight: 900; font-size: 11px;">라이트모드</span>`;
            btn.style.backgroundColor = '#ffffff'; 
            btn.style.color = '#121212';
        } else {
            btn.innerHTML = `<span style="font-size:14px;">🌙</span> <span style="font-weight: 900; font-size: 11px;">다크모드</span>`;
            btn.style.backgroundColor = '#34495e';
            btn.style.color = 'white';
        }
    }

    if (logo) {
        logo.src = isDark ? 'mlogo_dark.jpg' : 'mlogo.jpg';
    }
}
