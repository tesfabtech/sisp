import { OpportunityType } from "../../app/opportunities/page";

const FILTERS: OpportunityType[] = [
  "All",
  "Challenge",
  "Event",
  "Grant",
];

export default function OpportunityFilter({
  value,
  onChange,
}: {
  value: OpportunityType;
  onChange: (v: OpportunityType) => void;
}) {
  return (
    <div className="flex gap-2 bg-[#101a30] p-2 rounded-xl">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-2 rounded-lg text-sm transition ${
            value === f
              ? "bg-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
