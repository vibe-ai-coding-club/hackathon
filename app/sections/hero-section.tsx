import Link from "next/link";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[640px] overflow-hidden pt-[180px] pb-[100px] md:min-h-[900px] md:pt-[380px] md:pb-[300px]"
    >
      {/* TODO: 배경 이미지 확정 후 교체 */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#7b8794_0%,#9aa5b1_50%,#6c7983_100%)]" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-9 text-center md:px-8">
        <h1 className="text-[60px] leading-[1.1] font-bold tracking-[-0.4px] text-white md:text-[100px] md:leading-[0.95]">
          TTALKKAKTHON
        </h1>
        <p className="mt-4 text-[20px] leading-[30px] font-bold tracking-[-0.4px] text-white md:mt-6 md:text-[34px] md:leading-[52px]">
          <span className="md:hidden">
            엉뚱한 상상이
            <br />
            딸깍하고 현실이 되는 곳
          </span>
          <span className="hidden md:inline">엉뚱한 상상이 딸깍하고 현실이 되는 곳</span>
        </p>

        <Link
          href="/register"
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-primary-400 px-5 py-3 text-[18px] leading-[26px] font-semibold tracking-[-0.4px] text-white transition-colors hover:bg-primary-500 md:mt-15 md:rounded-2xl md:px-8 md:py-4 md:text-[24px] md:leading-[34px] md:font-bold"
        >
          지금 신청하기
        </Link>
      </div>
    </section>
  );
};
