"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  RotateCcw,
  Trash2,
} from "lucide-react";

type Event = {
  id: number;
  title: string;
  short_description?: string;
  event_datetime: string;
  location?: string;
};

export default function TrashedEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH TRASHED EVENTS ---------------- */

  useEffect(() => {
    const fetchTrashedEvents = async () => {
      try {
        const res = await axios.get("/organization/events/trashed");
        setEvents(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch trashed events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrashedEvents();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const restoreEvent = async (id: number) => {
    try {
      await axios.post(`/organization/events/${id}/restore`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to restore event", error);
    }
  };

  const deletePermanently = async (id: number) => {
    const confirmed = window.confirm(
      "This will permanently delete the event.\nThis action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/organization/events/${id}/force`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Failed to permanently delete event", error);
    }
  };

  /* ---------------- LAYOUT ---------------- */

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    router.push("/dashboard/organization/events")
                  }
                  className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to events
                </button>
              </div>

              <h1 className="text-2xl font-semibold">Trashed Events</h1>
            </div>

            {/* Content */}
            {loading ? (
              <p className="text-sm text-[#475467]">
                Loading trashed events…
              </p>
            ) : events.length === 0 ? (
              <p className="text-sm text-[#475467]">
                Trash is empty.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
                  >
                    <Calendar className="h-6 w-6 text-[#EF4444]" />

                    <h3 className="mt-4 text-lg font-semibold">
                      {event.title}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          event.event_datetime
                        ).toLocaleDateString()}
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => restoreEvent(event.id)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>

                      <button
                        onClick={() =>
                          deletePermanently(event.id)
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/20 px-3 py-1 text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete forever
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
