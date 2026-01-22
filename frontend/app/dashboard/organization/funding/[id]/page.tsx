"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

type Funding = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  deadline?: string;
  amount?: string | number;
  funding_type: string;
  application_number?: number;
  status: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  open: "bg-[#14B8A6]/10 text-[#14B8A6]",
  closed: "bg-[#6366F1]/10 text-[#6366F1]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
};

export default function ViewFundingPage() {
  const router = useRouter();
  const params = useParams();
  const fundingId = params.id;

  const [funding, setFunding] = useState<Funding | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH FUNDING ---------------- */
  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await axios.get(`/organization/funding/${fundingId}`);
        setFunding(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch funding opportunity", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunding();
  }, [fundingId]);

  /* ---------------- DELETE ---------------- */
  const deleteFunding = async () => {
    if (!funding) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this funding opportunity?\nYou can restore it later from Trash."
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/organization/funding/${funding.id}`);
      router.push("/dashboard/organization/funding");
    } catch (error) {
      console.error("Failed to delete funding opportunity", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to funding
            </button>

            {loading ? (
              <p className="text-sm text-[#475467]">Loading funding opportunity…</p>
            ) : !funding ? (
              <p className="text-sm text-[#EF4444]">Funding opportunity not found.</p>
            ) : (
              <div className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold">{funding.title}</h1>
                    {funding.short_description && (
                      <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                        {funding.short_description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[funding.status]}`}
                  >
                    {funding.status}
                  </span>
                </div>

                {funding.description && (
                  <div>
                    <h3 className="text-sm font-semibold">Description</h3>
                    <p className="mt-2 text-sm text-[#475467] dark:text-slate-400">
                      {funding.description}
                    </p>
                  </div>
                )}

                <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                  {funding.deadline && (
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {new Date(funding.deadline).toLocaleDateString()}
                    </p>
                  )}
                  {funding.amount && (
                    <p>
                      <strong>Amount:</strong> {funding.amount}
                    </p>
                  )}
                  <p>
                    <strong>Funding Type:</strong> {funding.funding_type}
                  </p>
                  {funding.application_number !== undefined && (
                    <p>
                      <strong>Application Limit:</strong> {funding.application_number}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/organization/funding/${funding.id}/edit`)
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={deleteFunding}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#EF4444]/30 px-4 py-2 text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
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
