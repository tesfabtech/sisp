"use client";

import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import CreateEventForm from "@/components/organization/events/create_form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-semibold">Create Event</h1>
              <p className="mt-1 text-sm text-[#475467] dark:text-slate-400">
                Fill in the information below to create a new event.
              </p>
            </div>

            {/* Create Event Form */}
            <CreateEventForm />
          </div>
        </main>
      </div>
    </div>
  );
}
