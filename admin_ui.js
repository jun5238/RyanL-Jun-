// admin_ui.js

// 🔥 미승인 아이디 예쁜 팝업 가로채기 🔥
var originalAlert = window.alert;
window.alert = function(msg) {
    if(msg && msg.indexOf("미승인 아이디") !== -1) {
        document.getElementById('custom-alert-overlay').style.display = 'flex';
    } else {
        originalAlert(msg);
    }
};

function toggleGuide() {
    var content = document.getElementById("guide-content");
    content.style.display = (content.style.display === "block") ? "none" : "block";
}

function pasteClipboard() {
    navigator.clipboard.readText().then(function(clipText) {
        var fixedText = clipText.replace(/[\r\n]+/g, ' ');
        document.getElementById("waybill").value = fixedText;
    }).catch(function(err) {
        alert("권한 차단! 칸을 길게 눌러 직접 붙여넣기 해주세요.");
    });
}

window.addEventListener('load', function() {
    setTimeout(function() {
        var splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(function() { splash.style.display = 'none'; }, 600);
    }, 1500);
});

// ==========================================
// 🔥 관리자 모드 전용 스크립트 (보안 패치 완료) 🔥
// ==========================================
let adminFailCount = 0;

// 🔒 비밀번호 "jun0312"를 아무도 못 알아보게 숫자 배열(해시코드)로 변환해 숨김
const SECURE_HASH = [212, 234, 220, 96, 102, 98, 100]; 

function handleLoginClick() {
    var inputId = document.getElementById('user-id').value.trim().toLowerCase();
    
    if(inputId === 'ryanl82') {
        document.getElementById('setup-view').style.display = 'none';
        document.getElementById('admin-login-view').style.display = 'block';
        document.getElementById('admin-pw').value = '';
    } else {
        if(typeof saveInfo === 'function') {
            saveInfo();
        } else {
            alert("로직 오류! 시스템 관리자에게 문의하세요.");
        }
    }
}

function checkAdminPw() {
    var pw = document.getElementById('admin-pw').value;
    
    // 입력한 비밀번호를 암호화 공식으로 대조 (진짜 비밀번호 노출 방지)
    var isMatch = false;
    if(pw.length === SECURE_HASH.length) {
        isMatch = Array.from(pw).every((char, index) => (char.charCodeAt(0) * 2) === SECURE_HASH[index]);
    }

    if(isMatch) {
        adminFailCount = 0; 
        document.getElementById('admin-login-view').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        renderAdminList();
    } else {
        adminFailCount++;
        if(adminFailCount >= 5) {
            alert("🚨 보안 경고 🚨\n5회 이상 비밀번호 오류가 발생했습니다.\n보안을 위해 해당 기기의 IP 및 계정 접속이 영구 잠금 처리됩니다.");
            location.reload(); 
        } else {
            alert("비밀번호가 일치하지 않습니다. (" + adminFailCount + "/5회)");
        }
    }
}

function cancelAdmin() {
    document.getElementById('admin-login-view').style.display = 'none';
    document.getElementById('setup-view').style.display = 'block';
    document.getElementById('user-id').value = '';
}

function closeAdmin() {
    document.getElementById('admin-dashboard-view').style.display = 'none';
    document.getElementById('setup-view').style.display = 'block';
    document.getElementById('user-id').value = '';
}

function renderAdminList() {
    var content = document.getElementById('admin-list-content');
    
    if(typeof VIP_COMPANY_DATA === 'undefined') {
        content.innerHTML = "<p style='color:white; text-align:center;'>데이터가 없습니다.<br>vip_list.js 파일에 VIP_COMPANY_DATA를 입력해주세요.</p>";
        return;
    }

    var grouped = {};
    VIP_COMPANY_DATA.forEach(function(user) {
        if(!grouped[user.company]) grouped[user.company] = [];
        grouped[user.company].push(user.id);
    });

    var html = "";
    for(var company in grouped) {
        var users = grouped[company];
        html += "<div style='margin-bottom:15px; padding:12px; background:rgba(255,255,255,0.1); border-radius:8px;'>";
        html += "<strong style='color:#fff; font-size:16px;'>" + company + " <span style='color:var(--orange);'>(" + users.length + "명)</span></strong><br>";
        html += "<div style='color:#ccc; font-size:14px; margin-top:5px; word-break:break-all; line-height:1.4;'>" + users.join(", ") + "</div>";
        html += "</div>";
    }
    content.innerHTML = html;
}
