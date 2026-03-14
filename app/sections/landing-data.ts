export type PointCard = {
  title: string;
  description: string;
  image: string;
};

export type TimetableItem = {
  title: string;
  time: string;
  description?: string;
};

export type CultureItem = {
  title: string;
  description: string;
  image: string;
};

export type InfoTabItem = {
  label: string;
  content: string[];
};

export const POINT_CARDS: PointCard[] = [
  {
    title: "단 하루, 8시간 만 진행해요",
    description: "2026.03.28 (09:30-18:00)",
    image: "/images/about-001.webp",
  },
  {
    title: "쾌적하고 넓은 공간을 제공해요",
    description: "AI 선두주자 숭실대학교",
    image: "/images/about-002.webp",
  },
  {
    title: "AI와 대화만 가능하면 참여 가능해요",
    description: "개인·팀 참가 가능",
    image: "/images/about-003.webp",
  },
];

export const TIMETABLE: TimetableItem[] = [
  { title: "참가자 현장 체크인", time: "09:30 - 10:00" },
  { title: "개회식 및 행사 안내", time: "10:00 - 10:30" },
  {
    title: "바이브코딩 세션",
    time: "10:30 - 11:30",
    description:
      "\"개발을 할 줄 모른다구요? '딸깍'이면 충분합니다\" AI를 내 비서로 부려 초고속으로 서비스를 빌딩하는 치트키 전수",
  },
  {
    title: "팀별 아이디어 피칭",
    time: "11:30 - 12:00",
    description: "우리가 만들 '세상 킹받는 서비스'는 무엇? 짧고 굵은 팀 소개",
  },
  {
    title: "집중 개발 시간",
    time: "12:00 - 16:00",
    description: "상상을 현실로 만드는 시간! 중간중간 다른 팀 구경은 필수(AI와 함께라면 4시간도 넉넉합니다)",
  },
  {
    title: "발표 및 심사",
    time: "16:00 - 17:30",
    description: '"누가 더 엉뚱한가!" 서로의 결과물을 시연하고 즐기는 시간. 다양한 이벤트도 준비되어있어요!',
  },
  { title: "시상 및 단체사진 촬영", time: "17:30 - 18:00" },
];

export const CULTURE_ITEMS: CultureItem[] = [
  {
    title: "바이브코딩 대환영",
    description: "이게 왜 돌아가지? 상관없어요. 작동만 하면 합격이에요. 진지하고 논리적인 질문은 정중히 사절해요.",
    image: "/images/culture-001.webp",
  },
  {
    title: "비개발자 특별 전형 오픈",
    description:
      "프로그램을 전혀 못 만들어도 괜찮아요. 우리에게 필요한 건 개성있는 기획력, 엉뚱한 디자인, 그리고 뻔뻔함이에요.",
    image: "/images/culture-002.webp",
  },
  {
    title: "AI 무제한 허용",
    description:
      "AI가 다 해줬어요! 라고 외쳐요. 훗날 AI가 세상을 지배할 때 살아남을 수 있도록, 솔직함에 대한 가산점을 고려해 드려요.",
    image: "/images/culture-003.webp",
  },
  {
    title: "버그는 곧 의도된 기능",
    description: "에러 창이 뜬다고요? 훌륭해요! 심사위원의 '대체 왜?' 질문을 방어할 뻔뻔한 설명을 준비해봐요.",
    image: "/images/culture-004.webp",
  },
  {
    title: "쓸모없음이 곧 최고의 스펙",
    description: "완벽히 무가치하고 쓸모없을수록 더 매력적이에요. 우리는 기발함과 유쾌함에 가장 높은 점수를 줘요.",
    image: "/images/culture-005.webp",
  },
];

export const INFO_TABS: InfoTabItem[] = [
  {
    label: "참가자 유의사항",
    content: [
      "개인 노트북 지참 필수: 원활한 빌딩을 위해 본인의 노트북과 충전기를 반드시 지참해 주세요.",
      "참가 확정 안내: 본 행사는 선착순 30명으로 운영됩니다. 확정 인원에게는 개별 확정 메일을 발송해 드리며, 이후 신청자는 예비 번호가 부여됩니다.",
      "참가비 환불: 인원 제한으로 인해 최종 확정되지 못한 신청자분들께는 참가비를 전액 환불해 드립니다.",
      "대중교통 이용 권장: 행사장 내 주차 지원이 어렵습니다. 숭실대입구역(7호선)과 가까우니 가급적 대중교통을 이용해 주세요.",
    ],
  },
  {
    label: "발표 및 심사 안내",
    content: [
      "엘리베이터 스피치: 발표는 핵심만 짧고 굵게 진행됩니다! 시간 초과 시 페널티가 있으니 타임 오버에 주의해 주세요.",
      "유연한 시연: 실시간 시연이 어렵다면 미리 준비한 녹화 영상이나 프로토타입으로 대체하셔도 좋습니다.",
      "심사 방식 및 기준: AI 심사와 참가자 상호 투표(Vibe-Voting)를 합산합니다. 아이디어의 유쾌함(얼마나 킹받는가!), AI 툴 활용도, 발표 전달력",
      "명예로운 기록: 본 행사는 상금보다 빌더 간의 유대와 성취에 집중하는 네트워킹 축제입니다. 별도의 물질적 상품 대신, 우승자의 영예와 함께 결과물 전시 및 커뮤니티 채널을 통한 홍보를 전폭적으로 지원해 드립니다.",
    ],
  },
];

export const SPONSOR_LOGOS = ["Vibe Coding Club", "Partner A", "Partner B"];
