const schedule = [
  { startTime: "10:30", title: "참가자 입장", timeRange: "10:30 - 11:00", highlight: false },
  { startTime: "11:00", title: "팀별 1분 소개 및 발표 순서 추첨", timeRange: "11:00 - 11:30", highlight: true },
  { startTime: "11:30", title: "개발 시간", timeRange: "11:30 - 16:00", highlight: true },
  { startTime: "12:30", title: "점심시간", timeRange: "12:30 - 13:30", highlight: false },
  { startTime: "16:00", title: "발표 및 심사", timeRange: "16:00 - 17:30", highlight: true },
  { startTime: "17:30", title: "이벤트, 시상, 단체사진 촬영", timeRange: "17:30 - 18:00", highlight: false },
];

export const ScheduleSection = () => {
  return (
    <section id="schedule" className="scroll-mt-16 bg-muted py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="mx-auto w-full max-w-5xl px-4 lg:max-w-4xl">
        {/* 라벨 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block w-8 h-0.5 bg-accent" />
          <span className="typo-subtitle2 text-accent tracking-widest">SCHEDULE</span>
        </div>

        <h2 className="typo-h3 mb-2">행사 일정</h2>
        <p className="typo-body3 mb-12 text-muted-foreground">
          장소 및 참가 인원에 따라 일부 변경될 수 있습니다.
        </p>

        <div className="space-y-4">
          {schedule.map((entry) => (
            <div key={entry.startTime} className="flex items-center gap-4">
              {/* 시간 */}
              <div className="typo-body3 w-14 shrink-0 text-right font-mono text-muted-foreground">
                {entry.startTime}
              </div>

              {/* 도트 */}
              <div
                className={`size-3 shrink-0 rounded-full ${
                  entry.highlight
                    ? "bg-accent"
                    : "border-2 border-muted-foreground/30 bg-background"
                }`}
              />

              {/* 카드 */}
              <div
                className={`flex-1 rounded-xl px-6 py-4 ${
                  entry.highlight ? "bg-accent/5" : "bg-background"
                }`}
              >
                <p className="typo-subtitle1">{entry.title}</p>
                <p className="typo-body3 text-muted-foreground">{entry.timeRange}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
