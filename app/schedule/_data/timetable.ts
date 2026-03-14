export type TimetableEntry = {
  time: string;
  title: string;
  note?: string;
  type: "default" | "break" | "highlight";
};

export const timetable: TimetableEntry[] = [
  {
    time: "09:30 – 10:00",
    title: "참가자 현장 체크인",
    type: "default",
  },
  {
    time: "10:00 – 10:30",
    title: "개회식 및 행사 안내",
    type: "default",
  },
  {
    time: "10:30 – 11:30",
    title: "바이브코딩 세션",
    type: "highlight",
  },
  {
    time: "11:30 – 12:00",
    title: "팀별 아이디어 피칭",
    type: "highlight",
  },
  {
    time: "12:00 – 16:00",
    title: "집중 개발 시간",
    type: "default",
  },
  {
    time: "16:00 – 17:30",
    title: "발표 및 심사",
    type: "highlight",
  },
  {
    time: "17:30 – 18:00",
    title: "시상 및 단체사진 촬영",
    type: "highlight",
  },
];
