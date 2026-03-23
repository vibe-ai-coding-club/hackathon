"use client";

import { useState } from "react";
import { AiPromptModal } from "./ai-prompt-modal";
import { TeamBoardProvider, useTeamBoard } from "./context";
import { InviteModal } from "./invite-modal";
import { LeaveModal } from "./leave-modal";
import { ProfileCard } from "./profile-card";
import { ProjectModal } from "./project-modal";
import { TeamBuildingSidebar } from "./team-building-sidebar";
import { TeamTable } from "./team-table";
import { TransferModal } from "./transfer-modal";

const TeamBoardInner = () => {
  const { loading, showProjectModal } = useTeamBoard();
  const [showAiPrompt, setShowAiPrompt] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-350 mx-auto space-y-4">
      <ProfileCard />
      <div className="flex gap-5">
        <TeamTable onShowAiPrompt={() => setShowAiPrompt(true)} />
        <div className="w-56 shrink-0">
          <TeamBuildingSidebar />
        </div>
      </div>
      <TransferModal />
      <LeaveModal />
      <InviteModal />
      {showProjectModal && <ProjectModal />}
      {showAiPrompt && <AiPromptModal onClose={() => setShowAiPrompt(false)} />}
    </div>
  );
};

export const TeamBoard = () => (
  <TeamBoardProvider>
    <TeamBoardInner />
  </TeamBoardProvider>
);
