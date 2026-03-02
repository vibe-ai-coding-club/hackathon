import Link from "next/link";

const DocIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </svg>
);

export const ApplySection = () => {
  return (
    <section className="bg-muted py-24 min-h-[60vh] flex flex-col justify-center">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* 중앙 라벨 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="inline-block w-8 h-0.5 bg-accent" />
          <span className="typo-subtitle2 text-accent tracking-widest">APPLY</span>
          <span className="inline-block w-8 h-0.5 bg-accent" />
        </div>

        <h2 className="typo-h3 mb-3">참가 신청</h2>
        <p className="typo-body3 mb-10 text-muted-foreground">
          아래 버튼을 통해 신청서를 작성하고 참가를 확정하세요.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="typo-btn3 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-white hover:bg-accent-hover transition-colors"
          >
            <DocIcon />
            신청서 작성하기
          </Link>
          <a
            href="#"
            className="typo-btn3 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-4 text-black hover:bg-amber-500 transition-colors"
          >
            <ExternalIcon />
            배포 링크 제출하기
          </a>
        </div>
      </div>
    </section>
  );
};
