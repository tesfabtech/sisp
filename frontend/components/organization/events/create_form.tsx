"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function CreateEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    event_datetime: "",
    location: "",
    event_type: "",
    venue: "",
  });

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- SUBMIT ---------------- */

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.post("/organization/events", form);
      router.push("/dashboard/organization/events");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <form
      onSubmit={submit}
      className="mt-6 space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]"
    >
      {/* Title */}
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          name="title"
          required
          value={form.title}
          onChange={handleChange}
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

      {/* Full Description */}
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

      {/* Date & Time */}
      <div>
        <label className="text-sm font-medium">Event Date & Time</label>
        <input
          type="datetime-local"
          name="event_datetime"
          required
          value={form.event_datetime}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
        />
        {errors.event_datetime && (
          <p className="mt-1 text-xs text-red-500">{errors.event_datetime}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="City, Country or URL"
          className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
        />
      </div>

      {/* Event Type */}
      <div>
        <label className="text-sm font-medium">Event Type</label>
        <select
          name="event_type"
          required
          value={form.event_type}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
        >
          <option value="">Select type</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="networking">Networking</option>
          <option value="bootcamp">Bootcamp</option>
          <option value="training">Training</option>
        </select>
        {errors.event_type && <p className="mt-1 text-xs text-red-500">{errors.event_type}</p>}
      </div>

      {/* Venue */}
      <div>
        <label className="text-sm font-medium">Venue</label>
        <select
          name="venue"
          required
          value={form.venue}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
        >
          <option value="">Select venue</option>
          <option value="physical">Physical</option>
          <option value="virtual">Virtual</option>
          <option value="hybrid">Hybrid</option>
        </select>
        {errors.venue && <p className="mt-1 text-xs text-red-500">{errors.venue}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#3B82F6] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
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
  );
}
