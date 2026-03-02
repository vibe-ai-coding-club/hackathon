const MailIcon = () => (
  <svg className="size-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ContactSection = () => {
  return (
    <section className="bg-muted py-24 min-h-[85vh] flex flex-col justify-center">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* 중앙 라벨 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="inline-block w-8 h-0.5 bg-accent" />
          <span className="typo-subtitle2 text-accent tracking-widest">CONTACT</span>
          <span className="inline-block w-8 h-0.5 bg-accent" />
        </div>

        <h2 className="typo-h3 mb-3">문의하기</h2>
        <p className="typo-body3 mb-10 text-muted-foreground">
          궁금한 점이 있으면 아래 이메일로 편하게 연락해 주세요.
        </p>

        <a
          href="mailto:vibecodingclub.team@gmail.com"
          className="typo-subtitle4 mx-auto inline-flex items-center gap-3 rounded-2xl bg-background px-8 py-5 hover:shadow-md transition-shadow"
        >
          <MailIcon />
          vibecodingclub.team@gmail.com
        </a>
      </div>
    </section>
  );
};
