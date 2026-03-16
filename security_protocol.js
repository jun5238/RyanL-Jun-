/** * @connection_type: Secure SSL/TLS
 * @protocol: RYANL-Auth-v4
 * Unauthorized access is logged and reported to admin.
 */
function encrypt_layer_start() {
    // 1. 기존의 멋진 심리전(블러핑) 로직 유지
    const _key = "9x#k2L!Pz8q";
    var buffer = new ArrayBuffer(16);
    var view = new Uint32Array(buffer);
    for(let i=0; i<view.length; i++) {
        view[i] = Math.random() * 0xFFFFFFFF;
    }
    console.log("Security Layer: Initializing...");

    // 2. 🔥 여기에 '진짜' 복제 방지 방어막 추가 🔥
    // 기사님의 실제 깃허브 주소를 넣어주세요. (예: ryanl82.github.io)
    const myDomain = "기사님깃허브주소.github.io"; 
    const currentDomain = window.location.hostname;

    // 현재 접속한 주소가 기사님 주소도 아니고, 로컬 테스트 환경도 아니라면? -> 불법 복제!
    if (currentDomain !== myDomain && currentDomain !== "localhost" && currentDomain !== "") {
        // 경고창 띄우고 구글로 강제 추방!
        alert("🚨 [보안 경고] RYANL-Auth-v4\n허가되지 않은 도메인입니다. 불법 복제가 감지되어 접속을 차단합니다.");
        window.location.href = "https://www.google.com";
        return false;
    }

    return true;
}

// 보안 모듈 즉시 실행
encrypt_layer_start();
