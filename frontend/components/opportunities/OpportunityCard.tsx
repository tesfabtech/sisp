'use client';

import Link from "next/link";
import {
  Trophy,
  Calendar,
  DollarSign,
} from "lucide-react";

const COLORS: Record<string, string> = {
  Challenge: "text-orange-400 bg-orange-400/10",
  Event: "text-blue-400 bg-blue-400/10",
  Grant: "text-green-400 bg-green-400/10",
};

type Opportunity = {
  slug: string;
  title: string;
  description: string;
  type: string;
  date: string;
  prize: string;
};

export default function OpportunityCard({
  data,
}: {
  data: Opportunity;
}) {
  return (
    <div className="bg-[#0f1b33] border border-white/5 rounded-2xl p-6 hover:border-blue-400/30 transition">

      {/* Icon */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg mb-4 ${
          COLORS[data.type] || "text-gray-400 bg-gray-400/10"
        }`}
      >
        <Trophy size={18} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">
        {data.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mt-2">
        {data.description}
      </p>

      {/* Info row */}
      <div className="flex justify-between text-sm text-gray-400 mt-4">
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {data.date}
        </span>

        <span className="flex items-center gap-1">
          <DollarSign size={14} /> {data.prize}
        </span>
      </div>

      {/* ✅ FIXED LINK */}
       <Link
        href={`/opportunities/${data.slug}`}
        className="mt-5 inline-block text-blue-400 text-sm hover:underline"
      >
        View Details →
      </Link>
      
    </div>
  );
}
