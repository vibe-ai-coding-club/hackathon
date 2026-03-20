export type Member = {
  id: string;
  name: string;
  isLeader: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  features: string | null;
  tools: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
};

export type Team = {
  id: string;
  order: number;
  leaderName: string;
  teamName: string | null;
  recruiting: boolean;
  recruitmentNote: string | null;
  participationType: string;
  experienceLevel: string;
  members: Member[];
  project: Project | null;
  membersCount: number;
  maxMembers: number;
  isMyTeam: boolean;
};

export const experienceLevelLabel: Record<string, string> = {
  BEGINNER: "입문",
  JUNIOR: "주니어",
  SENIOR: "시니어",
  VIBE_CODER: "바이브코더",
};

export const experienceLevelStyle: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  JUNIOR: "bg-blue-100 text-blue-700",
  SENIOR: "bg-purple-100 text-purple-700",
  VIBE_CODER: "bg-orange-100 text-orange-700",
};
