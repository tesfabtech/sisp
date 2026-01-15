"use client";

import { useState } from "react";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const initialChallenges = [
  {
    id: "1",
    title: "Green Energy Hackathon",
    description: "Innovate sustainable energy solutions.",
    deadline: "Apr 30, 2024",
    reward: "$10,000",
    participants: 250,
    status: "approved",
  },
  {
    id: "2",
    title: "AI for Social Good",
    description: "Use AI to solve social challenges.",
    deadline: "May 15, 2024",
    reward: "$5,000",
    participants: 0,
    status: "pending",
  },
];

/* ---------------- STATUS COLORS ---------------- */

const statusStyles: Record<string, string> = {
  approved: "bg-[#14B8A6]/10 text-[#14B8A6]",
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  draft: "bg-[#EEF2F6] text-[#475467]",
  rejected: "bg-[#EF4444]/10 text-[#EF4444]",
};

type Mode = "list" | "detail" | "edit";

export default function ChallengesPage() {
  const [mode, setMode] = useState<Mode>("list");
  const [challenges, setChallenges] = useState(initialChallenges);
  const [selected, setSelected] = useState<any>(null);

  /* ---------------- HANDLERS ---------------- */

  const openDetail = (challenge: any) => {
    setSelected(challenge);
    setMode("detail");
  };

  const openEdit = (challenge: any) => {
    setSelected(challenge);
    setMode("edit");
  };

  const saveEdit = () => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === selected.id ? selected : c))
    );
    setMode("detail");
  };

  const deleteChallenge = (id: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== id));
    setMode("list");
  };

  /* ---------------- LAYOUT ---------------- */

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          {/* ---------------- LIST VIEW ---------------- */}
          {mode === "list" && (
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Challenges</h1>

                <button className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  Create Challenge
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
                  >
                    <div className="flex items-center justify-between">
                      <Trophy className="h-6 w-6 text-[#14B8A6]" />
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[challenge.status]}`}
                      >
                        {challenge.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      {challenge.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {challenge.deadline}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {challenge.reward}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {challenge.participants} participants
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => openDetail(challenge)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      <button
                        onClick={() => openEdit(challenge)}
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
            </div>
          )}

          {/* ---------------- DETAIL / EDIT ---------------- */}
          {mode !== "list" && (
            <div className="mx-auto max-w-3xl space-y-6">
              <button
                onClick={() => setMode("list")}
                className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to challenges
              </button>

              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
                {mode === "detail" ? (
                  <>
                    <h2 className="text-xl font-semibold">{selected.title}</h2>
                    <p className="mt-2 text-sm text-[#475467] dark:text-slate-400">
                      {selected.description}
                    </p>

                    <div className="mt-6 space-y-2 text-sm">
                      <p><strong>Deadline:</strong> {selected.deadline}</p>
                      <p><strong>Reward:</strong> {selected.reward}</p>
                      <p><strong>Status:</strong> {selected.status}</p>
                    </div>

                    <button
                      onClick={() => setMode("edit")}
                      className="mt-6 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
                    >
                      Edit Challenge
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">Edit Challenge</h2>

                    <div className="mt-4 space-y-4">
                      <input
                        value={selected.title}
                        onChange={(e) =>
                          setSelected({ ...selected, title: e.target.value })
                        }
                        className="w-full rounded-md border border-[#E4E7EC] bg-[#F5F7FA] px-3 py-2 text-sm dark:border-[#1F2937] dark:bg-[#0B1220]"
                      />

                      <textarea
                        rows={4}
                        value={selected.description}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded-md border border-[#E4E7EC] bg-[#F5F7FA] px-3 py-2 text-sm dark:border-[#1F2937] dark:bg-[#0B1220]"
                      />
                    </div>

                    <button
                      onClick={saveEdit}
                      className="mt-6 rounded-xl bg-[#14B8A6] px-4 py-2 text-sm font-medium text-white"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
