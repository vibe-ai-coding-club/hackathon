"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav } from "../_components/admin-nav";
import { LogoutButton } from "../_components/logout-button";
import { VoteResultsTable } from "../_components/vote-results-table";
import { EventSettingControl } from "../_components/event-setting-control";

type SettingData = {
  id: string;
  maxVotes: number;
  presentingProjectId: string | null;
} | null;

type VoteResult = {
  projectId: string;
  title: string;
  teamName: string;
  voteCount: number;
  likeCount: number;
};

const AdminVotesPage = () => {
  const [setting, setSetting] = useState<SettingData>(null);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  const handlePresenting = async (projectId: string | null) => {
    try {
      const res = await fetch("/api/admin/event-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentingProjectId: projectId }),
      });
      const json = await res.json();
      if (json.success) {
        setSetting((prev) =>
          prev ? { ...prev, presentingProjectId: projectId } : prev,
        );
        fetchData();
      } else {
        alert(json.message);
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/event-setting");
      const json = await res.json();
      if (json.success) {
        setSetting(json.data.setting);
        setResults(json.data.results);
        setTotalVotes(json.data.totalVotes);
        setTotalLikes(json.data.totalLikes);
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

  // 5초 간격 자동 새로고침
  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="w-full max-w-360 mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h1 className="typo-h6">딸깍톤 Admin</h1>
          <AdminNav />
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center">
            <p className="typo-caption1 text-muted-foreground">로딩 중...</p>
          </div>
        ) : (
          <>
            <EventSettingControl
              setting={setting}
              projects={results}
              onRefresh={fetchData}
            />
            <VoteResultsTable
              results={results}
              totalVotes={totalVotes}
              totalLikes={totalLikes}
              presentingProjectId={setting?.presentingProjectId ?? null}
              onPresenting={handlePresenting}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVotesPage;
