import Image from "next/image";
import type { ReactElement } from "react";

import { Icon } from "@/app/_components/icon";
import type { StaffItem } from "@/app/sections/landing-data";

type StaffCardProps = {
  item: StaffItem;
};

type SocialLink = {
  href: string;
  label: string;
  icon: ReactElement;
};

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2);
};

export const StaffCard = ({ item }: StaffCardProps) => {
  const initials = getInitials(item.nickname);
  const socialLinks = [
    item.githubUrl
      ? {
          href: item.githubUrl,
          label: `${item.nickname} GitHub`,
          icon: <Icon type="github" width={20} height={20} />,
        }
      : null,
    item.linkedinUrl
      ? {
          href: item.linkedinUrl,
          label: `${item.nickname} LinkedIn`,
          icon: <Icon type="linkedin" width={20} height={20} />,
        }
      : null,
  ].filter((link): link is SocialLink => link !== null);

  return (
    <article className="relative flex min-w-[272px] items-center gap-4 rounded-[32px] border border-white/15 bg-white/10 px-5 py-6 text-white backdrop-blur-sm md:min-w-[340px] md:gap-6 md:px-6 md:py-6">
      {socialLinks.length > 0 && (
        <div className="absolute top-5 right-5 flex items-center gap-2.5 md:top-6 md:right-6 md:gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              className="text-white/72 transition hover:text-white"
            >
              {link.icon}
            </a>
          ))}
        </div>
      )}

      <div className="relative size-[88px] shrink-0 overflow-hidden rounded-full border border-white/20 bg-[linear-gradient(135deg,#fff_0%,#ffd3e4_45%,#ff76aa_100%)] md:size-[112px]">
        {item.profileImage ? (
          <Image
            src={item.profileImage}
            alt={`${item.nickname} profile`}
            fill
            sizes="(min-width: 768px) 112px, 88px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[28px] font-black tracking-[-0.04em] text-primary-700 md:text-[34px]">
            {initials}
          </div>
        )}
      </div>

      <div className={`min-w-0 flex-1 ${socialLinks.length > 0 ? "pr-12 md:pr-16" : ""}`}>
        <h3 className="truncate text-[24px] leading-[1] font-black tracking-[-0.04em] md:text-[30px]">
          {item.nickname}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.2] font-semibold tracking-[-0.01em] text-white/72 md:text-[15px]">
          {item.role}
        </p>
        <p className="mt-4 text-[14px] leading-[1.45] font-medium tracking-[-0.01em] text-white/88 md:text-[15px]">
          {item.oneLiner}
        </p>
      </div>
    </article>
  );
};
