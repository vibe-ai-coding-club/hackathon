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
    label: "참가 및 준비",
    content: [
      "기기 대여가 어려우니 참가자는 반드시 개인 노트북을 지참해 주세요.",
      "신청 폼에서 개인 참여와 팀 참여를 선택할 수 있어요.",
      "접수는 꼭 정해진 배포 링크를 사용해 주세요.",
      "행사 관련 공지와 안내는 메일 및 디스코드를 통해 전달돼요.",
      "행사장은 주차 지원이 어려워서 대중교통 이용을 권장해요.",
    ],
  },
  {
    label: "발표 및 심사",
    content: [
      "발표는 팀당 3분 발표 + 2분 질의응답으로 진행돼요.",
      "심사 기준은 아이디어의 유쾌함, AI 활용도, 발표 전달력이에요.",
      "완성도보다 시도와 스토리를 더 중요하게 평가해요.",
      "시연이 어려운 경우 화면 녹화나 프로토타입으로 대체 가능해요.",
      "시간 초과 시 감점이 있으니 발표 리허설을 추천해요.",
    ],
  },
];

export const SPONSOR_LOGOS = ["Vibe Coding Club", "Partner A", "Partner B"];
