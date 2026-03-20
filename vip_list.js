// ==========================================
// 1. 통합 승인 명단 (여기에만 적으시면 됩니다!)
// ==========================================
const VIP_COMPANY_DATA = [
    { id: "julee82", name: "이준희", company: "라이언엘" },
    { id: "hojingi0723", name: "호진기", company: "라이언엘" },
    { id: "ggomange86", name: "김현선", company: "라이언엘" },
    { id: "grow11", name: "심광석", company: "라이언엘" },
    { id: "oinoma0908", name: "이상희", company: "라이언엘" },
    { id: "dldudwls0530", name: "이영진", company: "모벤티스" },
    { id: "parkmjs2", name: "박만준", company: "라이언엘" },
    { id: "lhc3102", name: "이한철", company: "HO" },
    { id: "bear42b2", name: "황인호", company: "일성" },
    { id: "manoflogistics", name: "이영수", company: "모벤티스" },
    { id: "skycbtt", name: "최영환", company: "라이언엘" },
    { id: "sthlks1", name: "이기숙", company: "모벤티스" },
    { id: "rudghk3034", name: "박경화", company: "모벤티스" },
    { id: "jsa0524", name: "주혜숙", company: "유니스피어" },
    { id: "Rokmca12", name: "신설아", company: "모벤티스" }

    
    // 새로운 기사님은 이 아래에 계속 추가해주세요!
];

// ==========================================
// 2. 🚨 아래 코드는 절대 지우거나 수정하지 마세요! 🚨
// 기사님이 위에 적은 데이터에서 '아이디'만 쏙 뽑아서 기존 시스템으로 넘겨주는 마법 코드입니다.
// ==========================================
const VIP_LIST = VIP_COMPANY_DATA.map(function(user) { 
    return user.id; 
});
