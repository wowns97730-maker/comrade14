/* ==========================================================================
   comrade 14 — 사이트 설정과 제품 데이터
   이 파일만 고치면 사이트 전체가 바뀝니다.

   ■ 새 제품 추가하는 법
     1. 제품 사진을 images/ 폴더에 넣습니다. (흰 배경 누끼 사진 권장)
     2. 아래 PRODUCTS 목록 맨 끝에 한 덩어리를 복사해 붙이고 내용을 바꿉니다.

     {
       no: "025",                       // 카탈로그 번호 (겹치지 않게)
       name: "Product Name",            // 제품명 (영문)
       category: "Outerwear",           // Outerwear / Tops / Bottoms / Bags / Headwear / Accessories
       date: "2026-12",                 // 제작·발매 연-월
       status: "available",             // available(판매중) / soldout(품절) / archive(비매·기록용) / upcoming(발매 예정)
       price: 120000,                   // 원 단위 숫자. 비매품이면 null
       material: "Cotton 100%",
       color: "Black",
       sizes: ["1", "2", "3"],          // 단일 사이즈면 ["OS"]
       chart: "jacket",                 // 아래 CHARTS 중 하나. 없으면 지우고 dims 사용
       dims: "W 38 × H 42 × D 12 cm",   // 가방·소품용 치수 (chart 대신)
       desc: "한글 설명.",
       images: ["images/025-1.jpg", "images/025-2.jpg"],
     },
   ========================================================================== */

const SITE = {
  name: "comrade",
  number: "14",
  tagline: "Archive of made objects, 2024 —",
  email: "hello@comrade14.com",        // ← 실제 문의 받을 이메일로 바꿔주세요
  instagram: "comrade14",              // ← 실제 인스타그램 아이디로 바꿔주세요
  about: [
    "comrade 14는 직접 만든 옷과 물건을 번호 순서대로 기록하는 아카이브입니다. 만들어진 모든 제품은 카탈로그 번호를 받고, 판매가 끝난 뒤에도 이곳에 남습니다.",
    "소량으로 제작하며, 재고가 있는 제품은 문의를 통해 주문할 수 있습니다.",
  ],
  ordering: [
    "제품 페이지의 Inquire 버튼을 누르면 문의서가 열립니다. 사이즈와 내용을 적어 보내주시면 재고 확인 후 결제·배송 안내를 회신드립니다.",
    "품절·아카이브 제품도 재제작 문의를 받습니다.",
  ],
};

/* 사이즈 차트 (단위 cm) */
const CHARTS = {
  jacket: {
    cols: ["Size", "Length", "Chest", "Shoulder", "Sleeve"],
    rows: [["1", 64, 56, 47, 60], ["2", 66, 59, 49, 61.5], ["3", 68, 62, 51, 63]],
  },
  top: {
    cols: ["Size", "Length", "Chest", "Shoulder", "Sleeve"],
    rows: [["1", 68, 54, 48, 22], ["2", 70, 57, 50, 23], ["3", 72, 60, 52, 24]],
  },
  bottom: {
    cols: ["Size", "Waist", "Rise", "Thigh", "Hem", "Length"],
    rows: [["1", 38, 32, 33, 23, 100], ["2", 40, 33, 34.5, 24, 102], ["3", 42, 34, 36, 25, 104]],
  },
};

const PRODUCTS = [
  { no: "001", name: "Work Jacket Type-1", category: "Outerwear", date: "2024-03", status: "archive", price: null,
    material: "Cotton canvas 12 oz", color: "Ecru", sizes: ["1", "2", "3"], chart: "jacket",
    desc: "첫 번째로 만든 워크 재킷. 패턴 검증을 위한 샘플로 3벌만 제작했습니다.", images: ["images/logos/icon-01.png"] },
  { no: "002", name: "Field Shirt", category: "Tops", date: "2024-03", status: "archive", price: null,
    material: "Cotton poplin", color: "Off white", sizes: ["1", "2"], chart: "top",
    desc: "두 개의 가슴 포켓이 달린 필드 셔츠. 초기 샘플.", images: ["images/logos/icon-02.png"] },
  { no: "003", name: "Label Tee “Total Sale”", category: "Tops", date: "2024-05", status: "soldout", price: 48000,
    material: "Cotton jersey 20/1", color: "White", sizes: ["1", "2", "3"], chart: "top",
    desc: "가격표 라벨 그래픽을 실크스크린으로 찍은 티셔츠.", images: ["images/logos/icon-03.png"] },
  { no: "004", name: "Tool Bag S", category: "Bags", date: "2024-06", status: "soldout", price: 89000,
    material: "Waxed canvas, cotton webbing", color: "Black", sizes: ["OS"], dims: "W 30 × H 22 × D 12 cm",
    desc: "공구 가방 구조를 줄여 만든 작은 숄더백.", images: ["images/logos/icon-04.png"] },
  { no: "005", name: "Ration Cap", category: "Headwear", date: "2024-06", status: "archive", price: null,
    material: "Cotton ripstop", color: "Olive", sizes: ["OS"], dims: "Head 58 cm, adjustable",
    desc: "6패널 캡. 뒷면 스트랩으로 조절합니다.", images: ["images/logos/icon-05.png"] },
  { no: "006", name: "Fatigue Trousers", category: "Bottoms", date: "2024-09", status: "soldout", price: 168000,
    material: "Cotton back satin", color: "Olive", sizes: ["1", "2", "3"], chart: "bottom",
    desc: "패치 포켓이 달린 스트레이트 핏 퍼티그 팬츠.", images: ["images/logos/icon-06.png"] },
  { no: "007", name: "Quilted Liner Vest", category: "Outerwear", date: "2024-10", status: "archive", price: null,
    material: "Nylon ripstop, poly padding", color: "Sage", sizes: ["1", "2"], chart: "jacket",
    desc: "재킷 안에 겹쳐 입는 퀼팅 라이너 베스트.", images: ["images/logos/icon-07.png"] },
  { no: "008", name: "Depot Knit", category: "Tops", date: "2024-11", status: "soldout", price: 142000,
    material: "Wool 80%, nylon 20%", color: "Charcoal", sizes: ["1", "2", "3"], chart: "top",
    desc: "어깨와 팔꿈치에 패치를 덧댄 니트.", images: ["images/logos/icon-08.png"] },
  { no: "009", name: "Key Strap", category: "Accessories", date: "2024-11", status: "available", price: 28000,
    material: "Cotton webbing, steel hook", color: "Red", sizes: ["OS"], dims: "L 42 cm",
    desc: "벨트 고리에 거는 키 스트랩.", images: ["images/logos/icon-09.png"] },
  { no: "010", name: "Coverall Coat", category: "Outerwear", date: "2025-02", status: "soldout", price: 328000,
    material: "Cotton twill", color: "Navy", sizes: ["1", "2", "3"], chart: "jacket",
    desc: "커버올 재킷의 기장을 무릎까지 늘린 코트.", images: ["images/logos/icon-10.png"] },
  { no: "011", name: "Stamp Tee", category: "Tops", date: "2025-04", status: "available", price: 52000,
    material: "Cotton jersey 16/1", color: "White", sizes: ["1", "2", "3"], chart: "top",
    desc: "뒷목에 제작 일자를 스탬프로 찍은 티셔츠.", images: ["images/logos/icon-11.png"] },
  { no: "012", name: "Double Knee Shorts", category: "Bottoms", date: "2025-05", status: "soldout", price: 118000,
    material: "Cotton duck", color: "Brown", sizes: ["1", "2", "3"], chart: "bottom",
    desc: "무릎 덧댐 구조를 그대로 잘라낸 쇼츠.", images: ["images/logos/icon-12.png"] },
  { no: "013", name: "Market Tote", category: "Bags", date: "2025-05", status: "available", price: 64000,
    material: "Cotton canvas 16 oz", color: "Natural", sizes: ["OS"], dims: "W 44 × H 38 × D 14 cm",
    desc: "장바구니 크기의 토트백. 안쪽에 라벨 포켓이 있습니다.", images: ["images/logos/icon-13.png"] },
  { no: "014", name: "Comrade Jacket 14", category: "Outerwear", date: "2025-09", status: "available", price: 298000,
    material: "Wool melton, cupro lining", color: "Black", sizes: ["1", "2", "3"], chart: "jacket",
    desc: "이름과 같은 번호를 받은 대표 재킷. 네 개의 포켓과 숨은 단추 여밈.", images: ["images/logos/icon-14.png"] },
  { no: "015", name: "Ledger Shirt", category: "Tops", date: "2025-09", status: "available", price: 138000,
    material: "Cotton stripe broadcloth", color: "Blue stripe", sizes: ["1", "2", "3"], chart: "top",
    desc: "장부 줄무늬 원단으로 만든 셔츠.", images: ["images/logos/icon-15.png"] },
  { no: "016", name: "Wide Fatigue Trousers", category: "Bottoms", date: "2025-10", status: "available", price: 178000,
    material: "Cotton herringbone twill", color: "Black", sizes: ["1", "2", "3"], chart: "bottom",
    desc: "006의 폭을 넓힌 두 번째 버전.", images: ["images/logos/icon-16.png"] },
  { no: "017", name: "Watch Beanie", category: "Headwear", date: "2025-11", status: "soldout", price: 42000,
    material: "Wool 100%", color: "Red", sizes: ["OS"], dims: "W 21 × H 22 cm",
    desc: "짧게 접어 쓰는 와치 캡.", images: ["images/logos/icon-17.png"] },
  { no: "018", name: "Price Tag Scarf", category: "Accessories", date: "2025-12", status: "archive", price: null,
    material: "Wool gauze", color: "Red", sizes: ["OS"], dims: "W 35 × L 180 cm",
    desc: "가격표 형태의 자수 라벨을 단 스카프. 선물용으로 10장 제작.", images: ["images/logos/icon-18.png"] },
  { no: "019", name: "Shop Apron", category: "Accessories", date: "2026-03", status: "available", price: 76000,
    material: "Cotton canvas 12 oz", color: "Ecru", sizes: ["OS"], dims: "W 68 × L 84 cm",
    desc: "작업실에서 쓰는 앞치마. 허리와 가슴에 포켓 세 개.", images: ["images/logos/icon-19.png"] },
  { no: "020", name: "Canvas Chore Coat", category: "Outerwear", date: "2026-03", status: "available", price: 248000,
    material: "Cotton canvas 10 oz", color: "Ecru", sizes: ["1", "2", "3"], chart: "jacket",
    desc: "001을 다시 다듬어 만든 초어 코트.", images: ["images/logos/icon-20.png"] },
];
