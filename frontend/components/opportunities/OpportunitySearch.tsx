"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function OpportunitySearch({ value, onChange }: Props) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
      />

      <input
        type="text"
        placeholder="Search opportunities..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-full
          bg-white/5
          pl-11
          pr-4
          py-3
          text-white
          placeholder:text-white/40
          border border-white/10
          focus:border-blue-500/50
          focus:ring-2 focus:ring-blue-500/20
          outline-none
          transition
        "
      />
    </div>
  );
}
