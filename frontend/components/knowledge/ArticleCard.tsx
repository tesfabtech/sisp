"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";

export type Article = {
  id: number;
  slug: string; // ✅ ADD THIS
  title: string;
  description: string;
  image: string;
  author: string;
  readTime: string;
  category: string;
  tagColor: string;
};


export default function ArticleCard({ data }: { data: Article }) {
  return (
    <div className="group bg-[#0f1b33] border border-white/5 rounded-2xl overflow-hidden
      hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10 transition">

      {/* Image */}
      <div className="relative h-48">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover"
        />

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full ${data.tagColor}`}
        >
          {data.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <User size={14} />
            {data.author}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={14} />
            {data.readTime}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 group-hover:text-cyan-400 transition">
          {data.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4">
          {data.description}
        </p>

        {/* ✅ WORKING READ MORE */}
        <Link
          href={`/knowledge-hub/${data.slug}`}
          className="inline-block text-cyan-400 text-sm hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
