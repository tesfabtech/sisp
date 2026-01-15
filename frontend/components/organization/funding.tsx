"use client";

import { useState } from "react";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Wallet,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  ArrowLeft,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const initialFunding = [
  {
    id: "1",
    title: "Startup Seed Grant Q1 2024",
    type: "Grant",
    deadline: "Apr 15, 2024",
    amount: "$50,000",
    applications: 45,
    status: "approved",
  },
  {
    id: "2",
    title: "Innovation Research Fund",
    type: "Research Grant",
    deadline: "May 1, 2024",
    amount: "$25,000",
    applications: 0,
    status: "pending",
  },
  {
    id: "3",
    title: "Social Impact Investment",
    type: "Investment",
    deadline: "Jun 30, 2024",
    amount: "$100,000",
    applications: 0,
    status: "draft",
  },
  {
    id: "4",
    title: "Tech for Good Fellowship",
    type: "Fellowship",
    deadline: "Mar 31, 2024",
    amount: "$20,000",
    applications: 120,
    status: "approved",
  },
];

/* ---------------- STATUS STYLES ---------------- */

const statusStyles: Record<string, string> = {
  approved: "bg-[#14B8A6]/10 text-[#14B8A6]",
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  draft: "bg-[#EEF2F6] text-[#475467]",
  rejected: "bg-[#EF4444]/10 text-[#EF4444]",
};

type Mode = "list" | "detail" | "edit";

export default function FundingPage() {
  const [mode, setMode] = useState<Mode>("list");
  const [funding, setFunding] = useState(initialFunding);
  const [selected, setSelected] = useState<any>(null);

  /* ---------------- ACTIONS ---------------- */

  const openDetail = (item: any) => {
    setSelected(item);
    setMode("detail");
  };

  const openEdit = (item: any) => {
    setSelected(item);
    setMode("edit");
  };

  const saveEdit = () => {
    setFunding((prev) =>
      prev.map((f) => (f.id === selected.id ? selected : f))
    );
    setMode("detail");
  };

  const deleteFunding = (id: string) => {
    setFunding((prev) => prev.filter((f) => f.id !== id));
    setMode("list");
  };

  /* ---------------- PAGE ---------------- */

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
                <h1 className="text-2xl font-semibold">
                  Funding Opportunities
                </h1>

                <button className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                  <Plus className="h-4 w-4" />
                  Create Funding Call
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {funding.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
                        <Wallet className="h-5 w-5" />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#475467] dark:text-slate-400">
                      {item.type}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Deadline: {item.deadline}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {item.amount}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {item.applications} applications received
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-2">
                      <button
                        onClick={() => openDetail(item)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteFunding(item.id)}
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
          {mode !== "list" && selected && (
            <div className="mx-auto max-w-3xl space-y-6">
              <button
                onClick={() => setMode("list")}
                className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to funding
              </button>

              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
                {mode === "detail" ? (
                  <>
                    <h2 className="text-xl font-semibold">
                      {selected.title}
                    </h2>

                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>Type:</strong> {selected.type}</p>
                      <p><strong>Deadline:</strong> {selected.deadline}</p>
                      <p><strong>Amount:</strong> {selected.amount}</p>
                      <p><strong>Status:</strong> {selected.status}</p>
                      <p><strong>Applications:</strong> {selected.applications}</p>
                    </div>

                    <button
                      onClick={() => setMode("edit")}
                      className="mt-6 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
                    >
                      Edit Funding Call
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">
                      Edit Funding Opportunity
                    </h2>

                    <div className="mt-4 space-y-4">
                      <input
                        value={selected.title}
                        onChange={(e) =>
                          setSelected({ ...selected, title: e.target.value })
                        }
                        className="w-full rounded-md border border-[#E4E7EC] bg-[#F5F7FA] px-3 py-2 text-sm dark:border-[#1F2937] dark:bg-[#0B1220]"
                      />

                      <input
                        value={selected.amount}
                        onChange={(e) =>
                          setSelected({ ...selected, amount: e.target.value })
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
