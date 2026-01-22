"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { ArrowLeft } from "lucide-react";

type EventForm = {
  title: string;
  short_description?: string;
  description?: string;
  event_datetime: string;
  location?: string;
  event_type?: string;
  venue?: string;
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [form, setForm] = useState<EventForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------------- FETCH EVENT ---------------- */

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/organization/events/${eventId}`);
        const data = res.data.data ?? res.data;

        setForm({
          title: data.title,
          short_description: data.short_description ?? "",
          description: data.description ?? "",
          event_datetime: data.event_datetime.slice(0, 16), // datetime-local format
          location: data.location ?? "",
          event_type: data.event_type,
          venue: data.venue,
        });
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

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
      await axios.put(`/organization/events/${eventId}`, form);
      router.push("/dashboard/organization/events");
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    } finally {
      setSaving(false);
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
              Back to events
            </button>

            <div>
              <h1 className="text-2xl font-semibold">Edit Event</h1>
              <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                Update your event information below.
              </p>
            </div>

            {loading || !form ? (
              <p className="text-sm text-[#475467]">Loading event…</p>
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

                {/* Date */}
                <div>
                  <label className="text-sm font-medium">
                    Event Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="event_datetime"
                    value={form.event_datetime}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
                  />
                </div>
                
                {/* Event Type */}
<div>
  <label className="text-sm font-medium">Event Type</label>
  <select
    name="event_type"
    value={form.event_type ?? ""}
    onChange={handleChange}
    required
    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
  >
    <option value="">Select type</option>
    <option value="conference">Conference</option>
    <option value="workshop">Workshop</option>
    <option value="networking">Networking</option>
    <option value="bootcamp">Bootcamp</option>
    <option value="training">Training</option>
  </select>
  {errors.event_type && (
    <p className="mt-1 text-xs text-red-500">{errors.event_type}</p>
  )}
</div>

{/* Venue */}
<div>
  <label className="text-sm font-medium">Venue</label>
  <select
    name="venue"
    value={form.venue ?? ""}
    onChange={handleChange}
    required
    className="mt-1 w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm dark:bg-[#0B1220]"
  >
    <option value="">Select venue</option>
    <option value="physical">Physical</option>
    <option value="virtual">Virtual</option>
    <option value="hybrid">Hybrid</option>
  </select>
  {errors.venue && (
    <p className="mt-1 text-xs text-red-500">{errors.venue}</p>
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
