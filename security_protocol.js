// security_protocol.js (이 파일만 수정하세요!)

(function() {
    // [보안 1단계] 허수아비 블러핑 (코드 훔쳐보는 놈들 교란용)
    const _key = "9x#k2L!Pz8q";
    console.log("Security Layer: Initializing v4.0...");

    // [보안 2단계] 진짜 도메인 체크
    // 🚨 jun5238.github.io 가 아니면 접속을 차단합니다.
    const myDomain = "jun5238.github.io"; 
    const currentDomain = window.location.hostname;

    // 로컬 테스트(localhost)나 기사님 주소가 아니면 구글로 튕겨버림
    if (currentDomain !== myDomain && currentDomain !== "localhost" && currentDomain !== "") {
        alert("🚨 [보안 경고]\n허가되지 않은 도메인입니다.\n불법 복제가 감지되어 접속을 차단하며, IP가 기록되었습니다.");
        window.location.href = "https://www.google.com";
    }
})();
