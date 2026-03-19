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

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'admin-dashboard-view' && mutation.target.style.display !== 'none') {
            loadNoticeHistory();
        }
    });
});
window.addEventListener('load', () => {
    const adminView = document.getElementById('admin-dashboard-view');
    if(adminView) observer.observe(adminView, { attributes: true, attributeFilter: ['style'] });
});
