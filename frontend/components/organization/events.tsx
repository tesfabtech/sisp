"use client";

import { useState } from "react";
import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import {
  Calendar,
  MapPin,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const initialEvents = [
  {
    id: "1",
    title: "Tech Innovation Summit 2024",
    description: "Annual summit for emerging tech innovation.",
    date: "Mar 15, 2024",
    location: "San Francisco, CA",
    type: "Conference",
    status: "approved",
    updated: "2 hours ago",
  },
  {
    id: "2",
    title: "AI Workshop – Part 1",
    description: "Hands-on AI workshop.",
    date: "Mar 20, 2024",
    location: "Online",
    type: "Workshop",
    status: "pending",
    updated: "5 hours ago",
  },
];

/* ---------------- STATUS COLORS ---------------- */

const statusStyles: Record<string, string> = {
  approved: "bg-[#14B8A6]/10 text-[#14B8A6]",
  pending: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  draft: "bg-[#EEF2F6] text-[#475467]",
  rejected: "bg-[#EF4444]/10 text-[#EF4444]",
};

type Mode = "list" | "detail" | "edit";

export default function Events() {
  const [mode, setMode] = useState<Mode>("list");
  const [events, setEvents] = useState(initialEvents);
  const [selected, setSelected] = useState<any>(null);

  /* ---------------- ACTIONS ---------------- */

  const openDetail = (event: any) => {
    setSelected(event);
    setMode("detail");
  };

  const openEdit = (event: any) => {
    setSelected(event);
    setMode("edit");
  };

  const saveEdit = () => {
    setEvents((prev) =>
      prev.map((e) => (e.id === selected.id ? selected : e))
    );
    setMode("detail");
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setMode("list");
  };

  /* ---------------- LAYOUT ---------------- */

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          {/* ================= LIST ================= */}
          {mode === "list" && (
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Events</h1>

                <button className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  Create Event
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
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

                    <h3 className="mt-4 text-lg font-semibold">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-[#475467] dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => openDetail(event)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      <button
                        onClick={() => openEdit(event)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs hover:bg-[#EEF2F6] dark:hover:bg-white/10"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/20 px-3 py-1 text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= DETAIL / EDIT ================= */}
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
                {mode === "detail" ? (
                  <>
                    <h2 className="text-xl font-semibold">{selected.title}</h2>
                    <p className="mt-2 text-sm text-[#475467]">
                      {selected.description}
                    </p>

                    <div className="mt-6 space-y-2 text-sm">
                      <p><strong>Date:</strong> {selected.date}</p>
                      <p><strong>Location:</strong> {selected.location}</p>
                      <p><strong>Status:</strong> {selected.status}</p>
                    </div>

                    <button
                      onClick={() => setMode("edit")}
                      className="mt-6 rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white"
                    >
                      Edit Event
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">Edit Event</h2>

                    <div className="mt-4 space-y-4">
                      <input
                        value={selected.title}
                        onChange={(e) =>
                          setSelected({ ...selected, title: e.target.value })
                        }
                        className="w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm"
                      />

                      <textarea
                        rows={4}
                        value={selected.description}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded-md border bg-[#F5F7FA] px-3 py-2 text-sm"
                      />
                    </div>

                    <button
                      onClick={saveEdit}
                      className="mt-6 rounded-xl bg-[#14B8A6] px-4 py-2 text-sm font-medium text-white"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
