"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

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

export default function CreateChallengeForm() {
  const router = useRouter();
  const [form, setForm] = useState<ChallengeForm>({
    title: "",
    short_description: "",
    description: "",
    deadline: "",
    award: "",
    participant_number: undefined,
    type: "",
    status: "pending",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      await axios.post("/organization/challenges", form);
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
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
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
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
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

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#3B82F6] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Create Challenge"}
        </button>
      </div>
    </form>
  );
}
