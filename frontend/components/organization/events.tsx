"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import { useRouter } from "next/navigation";

import {
  Calendar,
  MapPin,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

/* ---------------- STATUS COLORS ---------------- */
const statusStyles: Record<string, string> = {
  published: "bg-[#14B8A6]/10 text-[#14B8A6]",
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  cancelled: "bg-[#EF4444]/10 text-[#EF4444]",
  completed: "bg-[#6366F1]/10 text-[#6366F1]",
};

type Mode = "list" | "detail" | "edit";

type Event = {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  event_datetime: string;
  location?: string;
  event_type: string;
  venue: string;
  status: string;
};

export default function Events() {
  const [mode, setMode] = useState<Mode>("list");
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Filters & search
  const [searchTitle, setSearchTitle] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterVenue, setFilterVenue] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* ---------------- FETCH EVENTS ---------------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/organization/events");
        setEvents(res.data.data ?? res.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  /* ---------------- FILTERED EVENTS ---------------- */
  const filteredEvents = events.filter((e) => {
    return (
      (!filterType || e.event_type === filterType) &&
      (!filterVenue || e.venue === filterVenue) &&
      (!filterStatus || e.status === filterStatus) &&
      (!searchTitle || e.title.toLowerCase().includes(searchTitle.toLowerCase()))
    );
  });

  /* ---------------- ACTIONS ---------------- */
  const openDetail = (event: Event) => {
    setSelected(event);
    setMode("detail");
  };

  const openEdit = (event: Event) => {
    setSelected(event);
    setMode("edit");
  };

  const deleteEvent = async (id: number) => {
    try {
      await axios.delete(`/organization/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setMode("list");
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  /* ---------------- LAYOUT ---------------- */
  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          {mode === "list" && (
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Events</h1>

                <div className="flex items-center gap-3">
                  {/* Trash */}
                  <button
                    onClick={() =>
                      router.push("/dashboard/organization/events/trash")
                    }
                    title="View trashed events"
                    className="inline-flex items-center justify-center rounded-xl border border-[#E4E7EC] p-2 text-[#475467] hover:bg-[#EEF2F6] dark:border-[#1F2937] dark:hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Create Event */}
                  <button
                    onClick={() =>
                      router.push("/dashboard/organization/events/create")
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563EB]"
                  >
                    <Plus className="h-4 w-4" />
                    Create Event
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm w-60 dark:bg-[#0B1220] dark:border-[#1F2937]"
                />

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                >
                  <option value="">All Types</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="networking">Networking</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="training">Training</option>
                </select>

                <select
                  value={filterVenue}
                  onChange={(e) => setFilterVenue(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                >
                  <option value="">All Venues</option>
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm dark:bg-[#0B1220] dark:border-[#1F2937]"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Event Cards */}
              {loading ? (
                <p className="text-sm text-[#475467]">Loading events…</p>
              ) : filteredEvents.length === 0 ? (
                <p className="text-sm text-[#475467]">No events match the filters.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-[#E4E7EC] bg-white p-5 dark:border-[#1F2937] dark:bg-[#101828]"
                    >
                      <div className="flex items-center justify-between">
                        <Calendar className="h-6 w-6 text-[#3B82F6]" />
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold">{event.title}</h3>

                      <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.event_datetime).toLocaleDateString()}
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/organization/events/${event.id}`)
                          }
                          className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/dashboard/organization/events/${event.id}/edit`)
                          }
                          className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to delete this event?\nYou can restore it later from Trash."
                            );
                            if (confirmed) deleteEvent(event.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/20 px-3 py-1 text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode !== "list" && selected && (
            <div className="mx-auto max-w-3xl space-y-6">
              <button
                onClick={() => setMode("list")}
                className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to events
              </button>

              <div className="rounded-2xl border border-[#E4E7EC] bg-white p-6 dark:border-[#1F2937] dark:bg-[#101828]">
                <h2 className="text-xl font-semibold">{selected.title}</h2>
                <p className="mt-2 text-sm text-[#475467]">
                  {selected.description || selected.short_description}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
