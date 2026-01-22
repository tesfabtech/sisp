"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

type Event = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  event_datetime: string;
  location?: string;
  event_type?: string;
  venue?: string;
  status: string;
};

const statusStyles: Record<string, string> = {
  published: "bg-[#14B8A6]/10 text-[#14B8A6]",
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  completed: "bg-[#6366F1]/10 text-[#6366F1]",
};

export default function ViewEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH EVENT ---------------- */

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/organization/events/${eventId}`);
        setEvent(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  /* ---------------- DELETE ---------------- */

  const deleteEvent = async () => {
    if (!event) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirm) return;

    try {
      await axios.delete(`/organization/events/${event.id}`);
      router.push("/dashboard/organization/events");
    } catch (error) {
      console.error("Failed to delete event", error);
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

            {loading ? (
              <p className="text-sm text-[#475467]">Loading event…</p>
            ) : !event ? (
              <p className="text-sm text-[#EF4444]">Event not found.</p>
            ) : (
              <div className="space-y-6 rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold">{event.title}</h1>

                    {event.short_description && (
                      <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                        {event.short_description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[event.status]}`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Meta */}
                <div className="space-y-3 text-sm text-[#475467] dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.event_datetime).toLocaleString()}
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}

                  {event.event_type && (
                    <p>
                      <strong>Type:</strong> {event.event_type}
                    </p>
                  )}

                  {event.venue && (
                    <p>
                      <strong>Venue:</strong> {event.venue}
                    </p>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <div>
                    <h3 className="text-sm font-semibold">Description</h3>
                    <p className="mt-2 text-sm text-[#475467] dark:text-slate-400">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/organization/events/${event.id}/edit`
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={deleteEvent}
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
