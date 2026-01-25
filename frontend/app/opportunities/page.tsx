"use client";

import { useMemo, useState } from "react";
import OpportunityCard from "../../components/opportunities/OpportunityCard";
import OpportunityFilter from "../../components/opportunities/OpportunityFilter";
import OpportunitySearch from "../../components/opportunities/OpportunitySearch";

export type OpportunityType = "All" | "Challenge" | "Event" | "Grant";

const OPPORTUNITIES = [
  {
    id: 1,
    title: "Agricultural Innovation",
    description: "Increase agricultural productivity and sustainability.",
    type: "Challenge",
    date: "Dec 31, 2024",
    prize: "$50,000",
  },
  {
    id: 2,
    title: "EdTech Hackathon",
    description: "48-hour hackathon for remote learning solutions.",
    type: "Challenge",
    date: "Nov 15, 2024",
    prize: "$25,000",
  },
  {
    id: 3,
    title: "Climate Action Pitch Competition",
    description: "Pitch climate-focused startups to investors.",
    type: "Challenge",
    date: "Oct 30, 2024",
    prize: "$75,000",
  },
  {
    id: 4,
    title: "Tech Innovation Summit 2024",
    description: "Annual innovation summit.",
    type: "Event",
    date: "Jan 15, 2025",
    prize: "Free Entry",
  },
  {
    id: 5,
    title: "Seed Funding Program",
    description: "Seed funding up to $100,000.",
    type: "Grant",
    date: "Mar 10, 2025",
    prize: "$100,000",
  },
];

export default function OpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OpportunityType>("All");

  const filteredData = useMemo(() => {
    return OPPORTUNITIES.filter((item) => {
      const matchesFilter =
        filter === "All" || item.type === filter;
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
            Opportunities
          </span>
          <h1 className="text-4xl font-bold mt-4">
            Explore <span className="text-blue-400">Growth Opportunities</span>
          </h1>
          <p className="text-gray-400 mt-3">
            Access challenges, events, and funding opportunities
          </p>
        </div>

        {/* Search row – centered */}
<div className="flex justify-center mb-4">
  <div className="w-full max-w-2xl">
    <OpportunitySearch value={query} onChange={setQuery} />
  </div>
</div>


{/* Filter row – centered */}
<div className="flex justify-center mb-8">
  <OpportunityFilter value={filter} onChange={setFilter} />
</div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <OpportunityCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
