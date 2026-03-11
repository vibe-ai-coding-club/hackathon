import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface User {
    memberId?: string;
    teamId?: string;
  }
  interface Session {
    user: {
      memberId?: string;
      teamId?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        phoneLast4: { type: "text" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const phoneLast4 = credentials?.phoneLast4 as string | undefined;

        if (!email || !phoneLast4 || phoneLast4.length !== 4) return null;

        const member = await prisma.member.findUnique({
          where: { email },
        });

        if (!member) return null;

        const memberPhoneLast4 = member.phone.slice(-4);
        if (memberPhoneLast4 !== phoneLast4) return null;

        return {
          id: member.id,
          name: member.name,
          email: member.email,
          memberId: member.id,
          teamId: member.teamId,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.memberId = user.memberId;
        token.teamId = user.teamId;
      }
      // 매 요청마다 DB에서 최신 teamId를 조회
      if (token.memberId) {
        const member = await prisma.member.findUnique({
          where: { id: token.memberId as string },
          select: { teamId: true },
        });
        if (member) {
          token.teamId = member.teamId;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.memberId = token.memberId as string | undefined;
        session.user.teamId = token.teamId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/teams/login",
  },
});
