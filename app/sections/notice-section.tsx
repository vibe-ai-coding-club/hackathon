const notices = [
  "본 행사는 오프라인으로만 진행됩니다.",
  "노트북은 개인 지참이 필요합니다.",
  "점심 식사가 제공됩니다.",
  "주차 지원은 별도로 안내드릴 예정입니다.",
  "행사 중 촬영된 사진은 홍보 목적으로 활용될 수 있습니다.",
  "참가 확정 후 무단 불참 시 향후 행사 참여가 제한될 수 있습니다.",
  "일정 및 장소는 사정에 따라 변경될 수 있으며, 변경 시 사전 공지합니다.",
];

export const NoticeSection = () => {
  return (
    <section id="notes" className="scroll-mt-16 py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="mx-auto max-w-3xl px-4">
        {/* 라벨 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block w-8 h-0.5 bg-accent" />
          <span className="typo-subtitle2 text-accent tracking-widest">NOTICE</span>
        </div>

        <h2 className="typo-h3 mb-10">유의 사항</h2>

        <div className="divide-y divide-border">
          {notices.map((item, index) => (
            <div key={index} className="flex gap-4 py-5">
              <span className="typo-body3 shrink-0 w-6 text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="typo-body3">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
