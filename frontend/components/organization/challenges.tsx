"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

/* ---------------- STATUS COLORS ---------------- */
const statusStyles: Record<string, string> = {
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  open: "bg-[#14B8A6]/10 text-[#14B8A6]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  closed: "bg-[#6366F1]/10 text-[#6366F1]",
};

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

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTitle, setSearchTitle] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* ---------------- FETCH FROM DATABASE ---------------- */
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get("/organization/challenges");
        setChallenges(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch challenges", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  /* ---------------- FILTERED CHALLENGES ---------------- */
  const filteredChallenges = challenges.filter((c) => {
    return (
      (!filterType || c.type === filterType) &&
      (!filterStatus || c.status === filterStatus) &&
      (!searchTitle || c.title.toLowerCase().includes(searchTitle.toLowerCase()))
    );
  });

  /* ---------------- DELETE CHALLENGE ---------------- */
  const deleteChallenge = async (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this challenge?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/organization/challenges/${id}`);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete challenge", error);
    }
  };

  /* ---------------- LAYOUT ---------------- */
  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header + Create / Trash Buttons */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Challenges</h1>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    router.push("/dashboard/organization/challenges/trash")
                  }
                  title="View trashed challenges"
                  className="inline-flex items-center justify-center rounded-xl border border-[#E4E7EC] p-2 text-[#475467] hover:bg-[#EEF2F6] dark:border-[#1F2937] dark:hover:bg-white/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() =>
                    router.push("/dashboard/organization/challenges/create")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
                >
                  <Plus className="h-4 w-4" />
                  Create Challenge
                </button>
              </div>
            </div>

            {/* ---------------- Filters and Search ---------------- */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm w-60 dark:bg-[#0B1220] dark:border-[#1F2937]"
              />

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
              >
                <option value="">All Types</option>
                <option value="innovation">Innovation</option>
                <option value="hackathon">Hackathon</option>
                <option value="pitch">Pitch</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="cancelled">Cancelled</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {loading ? (
              <p className="text-sm text-[#475467]">Loading challenges…</p>
            ) : filteredChallenges.length === 0 ? (
              <p className="text-sm text-[#475467]">No challenges match the filters.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Trophy className="h-6 w-6 text-[#14B8A6]" />
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[challenge.status]}`}
                      >
                        {challenge.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">{challenge.title}</h3>

                    {/* Meta */}
                    <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                      {challenge.deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </div>
                      )}
                      {challenge.award && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {challenge.award}
                        </div>
                      )}
                      {challenge.participant_number !== undefined && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {challenge.participant_number} participants
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/organization/challenges/${challenge.id}`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/organization/challenges/${challenge.id}/edit`
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteChallenge(challenge.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/20 px-3 py-1 text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
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
