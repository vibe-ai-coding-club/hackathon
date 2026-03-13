export type TimetableEntry = {
  time: string;
  title: string;
  note?: string;
  type: "default" | "break" | "highlight";
};

export const timetable: TimetableEntry[] = [
  {
    time: "10:00 – 11:00",
    title: "바이브코딩 OT",
    type: "default",
  },
  {
    time: "11:00 – 12:00",
    title: "팀별 간단 소개",
    type: "highlight",
  },
  {
    time: "12:00 – 13:00",
    title: "점심",
    type: "break",
  },
  {
    time: "13:00 – 16:00",
    title: "개발시간",
    type: "default",
  },
  {
    time: "16:00 – 17:30",
    title: "발표 (참가자 심사)",
    type: "highlight",
  },
  {
    time: "17:30 – 18:00",
    title: "이벤트(10분) / 시상 및 단체사진 촬영(19분, 1분)",
    type: "highlight",
  },
];
