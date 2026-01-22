"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function CreateFundingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    deadline: "",
    amount: "",
    funding_type: "",
    application_number: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/organization/funding", {
        ...form,
        amount: form.amount ? Number(form.amount) : null,
        application_number: form.application_number
          ? Number(form.application_number)
          : null,
      });

      router.push("/dashboard/organization/funding");
    } catch (error) {
      console.error("Failed to create funding opportunity", error);
      alert("Failed to create funding opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]"
    >
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Short Description</label>
        <input
          name="short_description"
          value={form.short_description}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Funding Type</label>
          <select
            name="funding_type"
            required
            value={form.funding_type}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
          >
            <option value="">Select type</option>
            <option value="grant">Grant</option>
            <option value="equity">Equity</option>
            <option value="loan">Loan / Debt</option>
            <option value="convertible_note">Convertible Note</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Application Limit</label>
          <input
            type="number"
            name="application_number"
            value={form.application_number}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-[#0B1220]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border px-4 py-2 text-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
        >
          {loading ? "Creating..." : "Create Funding"}
        </button>
      </div>
    </form>
  );
}
