"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { ArrowLeft } from "lucide-react";

type ChallengeForm = {
  title: string;
  short_description?: string;
  description?: string;
  deadline?: string;
  award?: string;
  participant_number?: number;
  type: string;
  status?: string;
};

export default function EditChallengePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState<ChallengeForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`/organization/challenges/${id}`);
        const data = res.data.data ?? res.data;

        setForm({
          title: data.title,
          short_description: data.short_description ?? "",
          description: data.description ?? "",
          deadline: data.deadline ? data.deadline.slice(0, 10) : "",
          award: data.award ?? "",
          participant_number: data.participant_number ?? undefined,
          type: data.type,
          status: data.status,
        });
      } catch (error) {
        console.error("Failed to fetch challenge", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

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
      await axios.put(`/organization/challenges/${id}`, form);
      router.push("/dashboard/organization/challenges");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setSaving(false);
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
              Back to challenges
            </button>

            <div>
              <h1 className="text-2xl font-semibold">Edit Challenge</h1>
              <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                Update your challenge information below.
              </p>
            </div>

            {loading || !form ? (
              <p className="text-sm text-[#475467]">Loading challenge…</p>
            ) : (
              <form
                onSubmit={submit}
                className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]"
              >
                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
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
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>

                {/* Award */}
                <div>
                  <label className="text-sm font-medium">Reward</label>
                  <input
                    name="award"
                    value={form.award}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>

                {/* Participant Number */}
                <div>
                  <label className="text-sm font-medium">Max Participants</label>
                  <input
                    type="number"
                    name="participant_number"
                    value={form.participant_number ?? ""}
                    onChange={handleChange}
                    min={0}
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>

                {/* Challenge Type */}
                <div>
                  <label className="text-sm font-medium">Challenge Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  >
                    <option value="">Select type</option>
                    <option value="innovation">Innovation</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="pitch">Pitch</option>
                  </select>
                </div>

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
                    onClick={() => router.back()}
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
