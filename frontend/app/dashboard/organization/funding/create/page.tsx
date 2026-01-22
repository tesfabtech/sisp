"use client";

import Sidebar from "@/components/organization/sidebar";
import Header from "@/components/organization/header";
import CreateFundingForm from "@/components/organization/funding/create_form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateFundingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] text-[#101828] dark:bg-[#0B1220] dark:text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-[#475467] hover:text-[#101828] dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to funding
            </button>

            <h1 className="text-2xl font-semibold">
              Create Funding Opportunity
            </h1>

            <CreateFundingForm />
          </div>
        </main>
      </div>
    </div>
  );
}
