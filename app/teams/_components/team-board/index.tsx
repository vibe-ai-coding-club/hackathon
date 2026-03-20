"use client";

import { useState } from "react";
import { AiPromptModal } from "./ai-prompt-modal";
import { TeamBoardProvider, useTeamBoard } from "./context";
import { LookingSidebar } from "./looking-sidebar";
import { ProjectModal } from "./project-modal";
import { RecruitingSidebar } from "./recruiting-sidebar";
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
    <div className="flex gap-5 px-4 py-6 max-w-350 mx-auto">
      <TeamTable onShowAiPrompt={() => setShowAiPrompt(true)} />
      <div className="w-56 shrink-0 space-y-3">
        <RecruitingSidebar />
        <LookingSidebar />
      </div>
      <TransferModal />
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
