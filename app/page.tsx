import { RegistrationForm } from "./_components/registration-form";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="text-sm font-bold tracking-tight">AI 해커톤 2026</span>
          <div className="flex gap-4 text-sm">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              소개
            </a>
            <a href="#schedule" className="text-muted-foreground hover:text-foreground transition-colors">
              일정
            </a>
            <a href="#register" className="text-muted-foreground hover:text-foreground transition-colors">
              참가 신청
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p className="rounded-full border border-border px-4 py-1 text-xs text-muted-foreground">
          2026.03.28 — 지구 어딘가
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-accent">AI</span> 잔망이 시작된다!
        </h1>
        <p className="max-w-lg text-muted-foreground">
          GPT x Claude x Gemini — 세 가지 AI를 활용하여 혁신적인 프로젝트를 만들어보세요. 8시간 동안의 치열한 대결이
          시작됩니다.
        </p>
        <a
          href="#register"
          className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          지금 참가 신청하기
        </a>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold">해커톤 소개</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-6">
              <div className="mb-3 text-2xl">🤖</div>
              <h3 className="mb-2 font-semibold">AI 활용</h3>
              <p className="text-sm text-muted-foreground">
                GPT, Claude, Gemini 등 다양한 AI 도구를 자유롭게 활용하여 프로젝트를 완성하세요.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <div className="mb-3 text-2xl">⏱️</div>
              <h3 className="mb-2 font-semibold">8시간</h3>
              <p className="text-sm text-muted-foreground">
                10:00부터 18:00까지, 제한된 시간 안에 아이디어를 구현하는 도전! 팀워크와 창의력이 핵심입니다.
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <div className="mb-3 text-2xl">🏆</div>
              <h3 className="mb-2 font-semibold">시상</h3>
              <p className="text-sm text-muted-foreground">
                우수 프로젝트에 대한 시상과 함께 네트워킹 기회를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="border-t border-border py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold">일정</h2>
          <div className="space-y-4">
            {[
              {
                date: "03.14 ~ 03.20",
                title: "참가 신청",
                desc: "온라인으로 팀 등록",
              },
              {
                date: "03.28 (토) 10:00",
                title: "개회식 및 주제 발표",
                desc: "해커톤 시작",
              },
              {
                date: "03.28 (토) 10:00 ~ 18:00",
                title: "해킹 타임",
                desc: "8시간 개발 진행",
              },
              {
                date: "03.28 (토) 18:00",
                title: "발표 및 심사",
                desc: "프로젝트 발표 & 시상식",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-lg border border-border p-4">
                <div className="w-36 shrink-0 text-sm font-mono text-accent">{item.date}</div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="border-t border-border py-20">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-2 text-2xl font-bold">참가 신청</h2>
          <p className="mb-8 text-sm text-muted-foreground">
            팀 정보와 팀원을 등록해주세요. 팀원은 최소 1명, 최대 5명까지 가능합니다.
          </p>
          <RegistrationForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 AI 해커톤. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
