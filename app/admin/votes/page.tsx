"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav } from "../_components/admin-nav";
import { LogoutButton } from "../_components/logout-button";
import { VoteResultsTable } from "../_components/vote-results-table";
import { VoteSessionControl } from "../_components/vote-session-control";

type SessionData = {
  id: string;
  isActive: boolean;
  maxVotes: number;
  startedAt: string | null;
  endedAt: string | null;
} | null;

type VoteResult = {
  projectId: string;
  title: string;
  teamName: string;
  voteCount: number;
};

const AdminVotesPage = () => {
  const [session, setSession] = useState<SessionData>(null);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/vote-session");
      const json = await res.json();
      if (json.success) {
        setSession(json.data.session);
        setResults(json.data.results);
        setTotalVotes(json.data.totalVotes);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 세션 활성 중이면 자동 새로고침
  useEffect(() => {
    if (!session?.isActive) return;

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [session?.isActive, fetchData]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="typo-h5">딸깍톤 Admin</h1>
        <LogoutButton />
      </div>

      <div className="space-y-8">
        <AdminNav />

        {loading ? (
          <div className="py-20 text-center">
            <p className="typo-body1 text-muted-foreground">로딩 중...</p>
          </div>
        ) : (
          <>
            <VoteSessionControl session={session} onRefresh={fetchData} />
            <VoteResultsTable results={results} totalVotes={totalVotes} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVotesPage;
