import { Logo } from "@/app/_components/logo";

export const FooterSection = () => {
  return (
    <footer className="bg-primary-400 px-4 pt-5 pb-[30px] text-white md:px-[60px] md:py-10">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[50px]">
        <div className="space-y-3 md:space-y-4">
          <Logo className="bg-white/25" />

          <div className="flex items-center gap-3 text-[12px] leading-[22px] font-medium md:text-[14px] md:leading-[24px] md:font-bold md:tracking-[-0.2px]">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:underline">
              Instagram
            </a>
            <span className="size-0.5 rounded-full bg-white" />
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 text-[10px] leading-[18px] tracking-[-0.2px] md:flex-row md:items-center md:justify-between md:gap-2 md:text-[14px] md:leading-[24px] md:tracking-[-0.4px]">
          <p>Talkkakthon 2026 by Vibe Coding Club</p>
          <p>문의: vibecodingclub.team@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};
