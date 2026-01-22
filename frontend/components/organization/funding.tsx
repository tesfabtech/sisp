"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Wallet,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

/* ---------------- STATUS COLORS ---------------- */
const statusStyles: Record<string, string> = {
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  open: "bg-[#14B8A6]/10 text-[#14B8A6]",
  closed: "bg-[#6366F1]/10 text-[#6366F1]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
};

/* ---------------- TYPES ---------------- */
type FundingOpportunity = {
  id: number;
  title: string;
  short_description?: string;
  deadline?: string;
  amount?: number;
  application_number?: number;
  funding_type: string;
  status: string;
};

export default function FundingPage() {
  const router = useRouter();
  const [funding, setFunding] = useState<FundingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FILTER/SEARCH STATE ---------------- */
  const [searchTitle, setSearchTitle] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAmount, setFilterAmount] = useState<number | "">("");

  /* ---------------- FETCH FUNDING ---------------- */
  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await axios.get("/organization/funding");
        setFunding(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch funding opportunities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFunding();
  }, []);

  /* ---------------- DELETE (SOFT) ---------------- */
  const deleteFunding = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this funding opportunity?\nYou can restore it later from Trash."
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/organization/funding/${id}`);
      setFunding((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to delete funding opportunity", error);
    }
  };

  /* ---------------- FILTERED FUNDING ---------------- */
  const filteredFunding = funding.filter((f) => {
    return (
      (!filterType || f.funding_type === filterType) &&
      (!filterStatus || f.status === filterStatus) &&
      (!filterAmount || (f.amount && f.amount <= filterAmount)) &&
      (!searchTitle || f.title.toLowerCase().includes(searchTitle.toLowerCase()))
    );
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Funding Opportunities</h1>

              <div className="flex items-center gap-3">
                {/* Trash */}
                <button
                  onClick={() =>
                    router.push("/dashboard/organization/funding/trash")
                  }
                  title="View trashed funding"
                  className="inline-flex items-center justify-center rounded-xl border border-[#E4E7EC] p-2 text-[#475467] hover:bg-[#EEF2F6] dark:border-[#1F2937] dark:hover:bg-white/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Create */}
                <button
                  onClick={() =>
                    router.push("/dashboard/organization/funding/create")
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
                >
                  <Plus className="h-4 w-4" />
                  Create Funding
                </button>
              </div>
            </div>

            {/* ---------------- SEARCH & FILTER ---------------- */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              {/* Search */}
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm w-60 dark:bg-[#0B1220] dark:border-[#1F2937]"
              />

              {/* Filter by type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
              >
                <option value="">All Types</option>
                <option value="grant">Grant</option>
                <option value="equity">Equity</option>
                <option value="loan">Loan/Debt</option>
                <option value="convertible_note">Convertible Note</option>
              </select>

              {/* Filter by status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Filter by max amount */}
              <input
                type="number"
                placeholder="Max Amount"
                value={filterAmount}
                onChange={(e) =>
                  setFilterAmount(e.target.value ? Number(e.target.value) : "")
                }
                className="rounded-lg border px-3 py-2 text-sm w-40 dark:bg-[#0B1220] dark:border-[#1F2937]"
              />
            </div>

            {/* Content */}
            {loading ? (
              <p className="text-sm text-[#475467]">
                Loading funding opportunities…
              </p>
            ) : filteredFunding.length === 0 ? (
              <p className="text-sm text-[#475467]">
                No funding opportunities found.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFunding.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
                  >
                    {/* Header */}
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

                    {/* Title */}
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>

                    {item.short_description && (
                      <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                        {item.short_description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                      {item.deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.deadline).toLocaleDateString()}
                        </div>
                      )}

                      {item.amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {item.amount.toLocaleString()}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {item.funding_type}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/organization/funding/${item.id}`
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
                            `/dashboard/organization/funding/${item.id}/edit`
                          )
                        }
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
