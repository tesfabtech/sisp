"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { Trash2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";

type Funding = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  deadline?: string;
  amount?: number;
  application_number?: number;
  funding_type: string;
  status: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  open: "bg-[#14B8A6]/10 text-[#14B8A6]",
  closed: "bg-[#6366F1]/10 text-[#6366F1]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
};

export default function TrashedFundingPage() {
  const router = useRouter();
  const [funding, setFunding] = useState<Funding[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH TRASHED ---------------- */
  useEffect(() => {
    const fetchTrashed = async () => {
      try {
        const res = await axios.get("/organization/funding/trashed");
        setFunding(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch trashed funding", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrashed();
  }, []);

  /* ---------------- RESTORE ---------------- */
  const restoreFunding = async (id: number) => {
    try {
      await axios.post(`/organization/funding/${id}/restore`);
      setFunding((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to restore funding", error);
    }
  };

  /* ---------------- FORCE DELETE ---------------- */
  const forceDeleteFunding = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this funding opportunity?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/organization/funding/${id}/force`);
      setFunding((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to permanently delete funding", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

       <main className="flex-1 px-6 py-6">
  <div className="mx-auto max-w-7xl space-y-6">
    {/* Back Button */}
    <button
      onClick={() => router.push("/dashboard/organization/funding")}
      className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400 dark:hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Funding
    </button>

    <h1 className="text-2xl font-semibold">Trashed Funding Opportunities</h1>

    {loading ? (
      <p className="text-sm text-[#475467]">Loading trashed funding…</p>
    ) : funding.length === 0 ? (
      <p className="text-sm text-[#475467]">No trashed funding opportunities.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {funding.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[f.status]}`}
              >
                {f.status}
              </span>
            </div>

            {/* Meta */}
            <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
              {f.deadline && (
                <div>
                  <strong>Deadline:</strong>{" "}
                  {new Date(f.deadline).toLocaleDateString()}
                </div>
              )}
              {f.amount && (
                <div>
                  <strong>Amount:</strong> ${f.amount.toLocaleString()}
                </div>
              )}
              {f.application_number !== undefined && (
                <div>
                  <strong>Applications:</strong> {f.application_number}
                </div>
              )}
              <div>
                <strong>Type:</strong> {f.funding_type}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => restoreFunding(f.id)}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs text-[#14B8A6] hover:bg-[#14B8A6]/10"
              >
                Restore
              </button>

              <button
                onClick={() => forceDeleteFunding(f.id)}
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
