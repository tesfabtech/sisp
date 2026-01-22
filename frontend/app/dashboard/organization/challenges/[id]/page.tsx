"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { ArrowLeft, Pencil, Trash2, Calendar, Users } from "lucide-react";

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

export default function ViewChallengePage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  /* ---------------- FETCH CHALLENGE ---------------- */
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`/organization/challenges/${challengeId}`);
        setChallenge(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch challenge", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  /* ---------------- DELETE ---------------- */
  const deleteChallenge = async () => {
    if (!challenge) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this challenge?"
    );

    if (!confirm) return;

    setDeleting(true);
    try {
      await axios.delete(`/organization/challenges/${challenge.id}`);
      router.push("/dashboard/organization/challenges");
    } catch (error) {
      console.error("Failed to delete challenge", error);
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to challenges
            </button>

            {loading ? (
              <p className="text-sm text-[#475467]">Loading challenge…</p>
            ) : !challenge ? (
              <p className="text-sm text-[#EF4444]">Challenge not found.</p>
            ) : (
              <div className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold">{challenge.title}</h1>

                    {challenge.short_description && (
                      <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                        {challenge.short_description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[challenge.status]}`}
                  >
                    {challenge.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="space-y-3 text-sm text-[#475467] dark:text-slate-400">
                  {challenge.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </div>
                  )}

                  {challenge.participant_number !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {challenge.participant_number} participants
                    </div>
                  )}

                  <p>
                    <strong>Type:</strong> {challenge.type}
                  </p>

                  {challenge.award && (
                    <p>
                      <strong>Reward:</strong> {challenge.award}
                    </p>
                  )}
                </div>

                {/* Description */}
                {(challenge.description || challenge.short_description) && (
                  <div>
                    <h3 className="text-sm font-semibold">Description</h3>
                    <p className="mt-2 text-sm text-[#475467] dark:text-slate-400">
                      {challenge.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/organization/challenges/${challenge.id}/edit`
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={deleteChallenge}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#EF4444]/30 px-4 py-2 text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
