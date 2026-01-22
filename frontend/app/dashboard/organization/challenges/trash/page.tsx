"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { Trash2 } from "lucide-react";

type Challenge = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  deadline?: string;
  award?: string;
  participant_number?: number;
  type: string;
  status: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  open: "bg-[#14B8A6]/10 text-[#14B8A6]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  closed: "bg-[#6366F1]/10 text-[#6366F1]",
};

export default function TrashedChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrashed = async () => {
      try {
        const res = await axios.get("/organization/challenges/trashed");
        setChallenges(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch trashed challenges", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrashed();
  }, []);

  const restoreChallenge = async (id: number) => {
    try {
      await axios.post(`/organization/challenges/${id}/restore`);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to restore challenge", error);
    }
  };

  const forceDeleteChallenge = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this challenge?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/organization/challenges/${id}/force`);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to permanently delete challenge", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

       <main className="flex-1 px-6 py-6">
  <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Trashed Challenges</h1>

      <button
        onClick={() => router.push("/dashboard/organization/challenges")}
        className="inline-flex items-center gap-2 rounded-xl border border-[#E4E7EC] px-4 py-2 text-sm text-[#475467] hover:bg-[#EEF2F6]"
      >
        Back to Challenges
      </button>
    </div>

    {loading ? (
      <p className="text-sm text-[#475467]">Loading trashed challenges…</p>
    ) : challenges.length === 0 ? (
      <p className="text-sm text-[#475467]">No trashed challenges.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{challenge.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[challenge.status]}`}
              >
                {challenge.status}
              </span>
            </div>

            {/* Meta */}
            <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
              {challenge.deadline && (
                <div>
                  <strong>Deadline:</strong>{" "}
                  {new Date(challenge.deadline).toLocaleDateString()}
                </div>
              )}
              {challenge.award && (
                <div>
                  <strong>Reward:</strong> {challenge.award}
                </div>
              )}
              {challenge.participant_number !== undefined && (
                <div>
                  <strong>Participants:</strong> {challenge.participant_number}
                </div>
              )}
              <div>
                <strong>Type:</strong> {challenge.type}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => restoreChallenge(challenge.id)}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs text-[#14B8A6] hover:bg-[#14B8A6]/10"
              >
                Restore
              </button>

              <button
                onClick={() => forceDeleteChallenge(challenge.id)}
                className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/20 px-3 py-1 text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
              >
                <Trash2 className="h-3 w-3" />
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</main>

      </div>
    </div>
  );
}
