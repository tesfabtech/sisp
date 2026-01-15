"use client";

import {
  Mail,
  Phone,
  Globe,
  MapPin,
  ShieldCheck,
  Camera,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div
        className="
          relative h-40 overflow-hidden rounded-2xl
          bg-gradient-to-r from-[#3B82F6] to-[#0EA5E9]
          z-0
        "
      >
        <button
          className="
            absolute bottom-3 right-3 z-10
            inline-flex items-center gap-2
            rounded-lg
            bg-white/90 px-3 py-1.5
            text-xs font-medium text-[#101828]
            shadow-sm hover:bg-white
          "
        >
          <Camera className="h-3.5 w-3.5" />
          Change cover
        </button>
      </div>

      {/* Header */}
      <div className="relative -mt-14 z-10 flex items-center gap-5 px-6">
        <div
          className="
            flex h-28 w-28 items-center justify-center
            rounded-full
            bg-gradient-to-br from-[#3B82F6] to-[#0EA5E9]
            text-2xl font-semibold text-white
            shadow-lg
            ring-4 ring-[#F5F7FA] dark:ring-[#0B1220]
          "
        >
          IH
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-[#101828] dark:text-white">
            Innovation Hub
          </h1>
          <p className="text-sm text-[#475467] dark:text-gray-400">
            Organization Profile
          </p>
        </div>
      </div>

      {/* Organization Details */}
      <div
        className="
          rounded-2xl border
          border-[#E4E7EC] dark:border-[#1F2937]
          bg-white dark:bg-[#101828]
          p-6
        "
      >
        <h2 className="mb-4 text-lg font-semibold text-[#101828] dark:text-white">
          Organization Details
        </h2>

        <div className="space-y-4 text-sm text-[#101828] dark:text-gray-300">
          <div>
            <p className="text-[#667085] dark:text-gray-400">
              Organization Name
            </p>
            <p className="font-medium">Innovation Hub</p>
          </div>

          <div>
            <p className="text-[#667085] dark:text-gray-400">
              Description
            </p>
            <p className="leading-relaxed">
              Leading innovation center fostering entrepreneurship
              and technological advancement in the region. We connect
              startups with resources, mentorship, and funding
              opportunities.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#0EA5E9]" />
              <span>contact@innovationhub.org</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#0EA5E9]" />
              <span>+1 (555) 123-4567</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#0EA5E9]" />
              <a
                href="https://innovationhub.org"
                className="text-[#3B82F6] hover:underline"
              >
                https://innovationhub.org
              </a>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#0EA5E9]" />
              <span>
                123 Innovation Drive, Tech City, TC 12345
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification */}
      <div
        className="
          rounded-2xl border
          border-[#14B8A6]/30
          bg-[#14B8A6]/10 p-5
        "
      >
        <div className="flex items-center gap-3 text-[#14B8A6]">
          <ShieldCheck className="h-5 w-5" />
          <div>
            <p className="font-medium">
              Verification Status
            </p>
            <p className="text-sm">
              Your organization has been verified by platform
              administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
