"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

type FundingForm = {
  title: string;
  short_description?: string;
  description?: string;
  deadline?: string;
  amount?: string | number;
  funding_type?: string;
  application_number?: string | number;
  status?: string;
};

const fundingTypes = [
  { value: "grant", label: "Grant" },
  { value: "equity", label: "Equity" },
  { value: "loan", label: "Loan/Debt" },
  { value: "convertible_note", label: "Convertible Note" },
];

const fundingStatus = ["pending", "open", "closed", "cancelled"];

export default function EditFundingPage() {
  const router = useRouter();
  const params = useParams();
  const fundingId = params.id;

  const [form, setForm] = useState<FundingForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------------- FETCH FUNDING ---------------- */
  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await axios.get(`/organization/funding/${fundingId}`);
        const data = res.data.data ?? res.data;

        setForm({
          title: data.title,
          short_description: data.short_description ?? "",
          description: data.description ?? "",
          deadline: data.deadline ? data.deadline.slice(0, 10) : "",
          amount: data.amount ?? "",
          funding_type: data.funding_type ?? "",
          application_number: data.application_number ?? "",
          status: data.status ?? "pending",
        });
      } catch (error) {
        console.error("Failed to fetch funding opportunity", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunding();
  }, [fundingId]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setErrors({});

    try {
      await axios.put(`/organization/funding/${fundingId}`, {
        title: form.title,
        short_description: form.short_description || null,
        description: form.description || null,
        deadline: form.deadline || null,
        amount: form.amount !== "" ? Number(form.amount) : null,
        funding_type: form.funding_type,
        application_number:
          form.application_number !== "" ? Number(form.application_number) : null,
        status: form.status || undefined,
      });

      router.push(`/dashboard/organization/funding/${fundingId}`);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Failed to update funding opportunity", err);
      }
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteFunding = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this funding opportunity?\nYou can restore it later from Trash."
    );
    if (!confirmDelete || !form) return;

    try {
      await axios.delete(`/organization/funding/${fundingId}`);
      router.push("/dashboard/organization/funding");
    } catch (err) {
      console.error("Failed to delete funding opportunity", err);
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
              Back to funding
            </button>

            {loading || !form ? (
              <p className="text-sm text-[#475467]">Loading funding opportunity…</p>
            ) : (
              <form
                onSubmit={submit}
                className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]"
              >
                <h1 className="text-2xl font-semibold">Edit Funding Opportunity</h1>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="text-sm font-medium">Short Description</label>
                  <input
                    name="short_description"
                    value={form.short_description}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                  />
                  {errors.short_description && (
                    <p className="mt-1 text-xs text-red-500">{errors.short_description}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Deadline */}
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-xs text-red-500">{errors.deadline}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
                  )}
                </div>

                {/* Funding Type */}
                <div>
                  <label className="text-sm font-medium">Funding Type</label>
                  <select
                    name="funding_type"
                    value={form.funding_type}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                    required
                  >
                    <option value="">Select Type</option>
                    {fundingTypes.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  {errors.funding_type && (
                    <p className="mt-1 text-xs text-red-500">{errors.funding_type}</p>
                  )}
                </div>

                {/* Application Number */}
                <div>
                  <label className="text-sm font-medium">Application Number</label>
                  <input
                    type="number"
                    name="application_number"
                    value={form.application_number}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                  />
                  {errors.application_number && (
                    <p className="mt-1 text-xs text-red-500">{errors.application_number}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#3B82F6] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteFunding()}
                    className="rounded-xl border px-5 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/organization/funding")}
                    className="rounded-xl border px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
