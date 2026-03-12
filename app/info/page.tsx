import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "행사 정보",
  description: "딸깍톤 2026 행사 안내사항, 규칙, 심사기준, 문의처 등 모든 정보를 확인하세요.",
};

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <h1 className="mb-12 text-3xl font-bold tracking-tight">행사 정보</h1>

      {/* 행사 개요 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">행사 개요</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="mb-1 text-sm text-muted-foreground">일시</p>
            <p className="font-medium">2026년 3월 28일 (토) 10:00 – 18:00</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-1 text-sm text-muted-foreground">장소</p>
            <p className="font-medium">추후 공지</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-1 text-sm text-muted-foreground">참가자격</p>
            <p className="font-medium">AI와 대화가 가능한 사람, 진지함 빼고 즐길 준비가 된 사람</p>
          </div>
        </div>
      </section>

      {/* 안내사항 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">안내사항</h2>
        <ul className="space-y-3">
          {[
            "참가자는 반드시 개인 노트북을 지참해 주시기 바랍니다.",
            "개인 참여 및 팀 참여 모두 가능합니다.",
            "접수는 꼭 정해진 배포 링크 사용 부탁드립니다.",
            "팀당 발표는 2분씩 제한됩니다. (시간 초과 시 마이크 차단될 수 있음)",
            "행사 관련 공지 및 안내는 피그잼을 통해 전달됩니다.",
            "행사장은 주차 지원이 불가하므로 대중교통 이용을 권장드립니다.",
            "발표 자료 형식은 자유입니다. 다만, 배포 링크는 반드시 제출해 주셔야 합니다.",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span className="shrink-0 text-muted-foreground">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 규칙 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">규칙</h2>
        <div className="space-y-4">
          {[
            {
              emoji: "🔥",
              title: "바이브코딩 대환영",
              desc: '"어? 이게 왜 돌아가지?" 상관없습니다. 작동만 하면 합격입니다. 돌아가는 원리에 대한 진지하고 논리적인 질문은 정중히 사절합니다.',
            },
            {
              emoji: "🙌",
              title: "비개발자 특별 전형 오픈",
              desc: "프로그램을 전혀 못 만들어도 괜찮습니다. 우리에게 필요한 건 당신의 기획력, 디자인, 화려한 발표 솜씨, 그리고 무엇보다 심사위원을 압도할 뻔뻔함입니다.",
            },
            {
              emoji: "🤖",
              title: "AI 무제한 허용",
              desc: '기획이나 제작을 인공지능이 다 했나요? "인공지능님이 다 해주셨습니다"라고 솔직하게 고백하세요. 훗날 AI가 세상을 지배할 때 살아남을 수 있도록, 솔직함에 대한 가산점을 고려해 드립니다.',
            },
            {
              emoji: "🐛",
              title: "버그는 곧 의도된 기능",
              desc: "에러 창이 뜬다고요? 훌륭합니다. 단, 심사위원들의 날카로운 '대체 왜?' 청문회를 방어할 기가 막힌 철학적 궤변과 변명거리는 반드시 준비해 오셔야 합니다.",
            },
            {
              emoji: "🧠",
              title: "쓸모없음이 곧 최고의 스펙",
              desc: "경고. 이 행사는 인류의 발전과 실용성을 절대 장려하지 않습니다. 당신의 결과물이 완벽하게 무가치하고 쓸모없을수록, 우승과 가까워집니다.",
            },
          ].map((rule) => (
            <div key={rule.title} className="rounded-lg border border-border p-4">
              <p className="mb-1 font-semibold">
                {rule.emoji} {rule.title}
              </p>
              <p className="text-sm text-muted-foreground">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 심사 기준 */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">심사 기준</h2>
        <div className="rounded-lg border border-border p-4 text-sm space-y-2">
          <p>
            심사는 <strong>현장 심사</strong>와 <strong>참가자 투표</strong>를 합산하여 진행됩니다.
          </p>
          <p>비중: 참가자 투표 50% + 심사위원 50%</p>
          <p className="text-muted-foreground">
            점수는 매우 주관적입니다. 발표력은 실력보다 뻔뻔함이 중요할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 문의처 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">문의처</h2>
        <p className="text-sm">
          이메일:{" "}
          <a
            href="mailto:vibecodingclub.team@gmail.com"
            className="text-accent underline hover:text-accent-hover transition-colors"
          >
            vibecodingclub.team@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
