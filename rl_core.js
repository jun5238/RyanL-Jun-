/* System Core Module v2.4.1 */
const _0x1a = localStorage; 
function _0x3d() { 
    const i = _0x1a.getItem('rl_id'), c = _0x1a.getItem('rl_camp'); 
    if(i && c) { 
        document.getElementById('setup-view').style.display = 'none'; 
        document.getElementById('main-view').style.display = 'block'; 
        document.getElementById('display-id').innerText = i; 
        document.getElementById('display-camp').innerText = c; 
        document.getElementById('form-id').value = i; 
        document.getElementById('form-camp').value = c; 
    } 
}
function saveInfo() { 
    const i = document.getElementById('user-id').value, c = document.getElementById('user-camp').value; 
    if(i && c) { _0x1a.setItem('rl_id', i); _0x1a.setItem('rl_camp', c); _0x3d(); } 
    else { alert('입력 확인!'); } 
}
function showSetup() { 
    document.getElementById('setup-view').style.display = 'block'; 
    document.getElementById('main-view').style.display = 'none'; 
}
window.onload = _0x3d;
