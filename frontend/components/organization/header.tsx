"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ first_name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", next);
  };

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <header
      className="
        sticky top-0 z-50
        flex items-center justify-between
        px-6 py-4
        border-b
        bg-[#F5F7FA]/80 backdrop-blur-xl
        border-[#E4E7EC]
        dark:bg-[#0B1220]/80 dark:border-[#1F2937]
      "
    >
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-[#101828] dark:text-white">
          Welcome back{user ? `, ${user.first_name}` : ""}
        </h2>
        <p className="text-sm text-[#667085] dark:text-gray-400">
          Manage your organization in one place.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 relative">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
          <input
            placeholder="Search..."
            className="
              w-72 rounded-xl
              border border-[#D0D5DD]
              bg-white
              px-9 py-2 text-sm
              text-[#101828]
              placeholder:text-[#667085]
              focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40
              dark:bg-[#101828] dark:border-[#1F2937]
              dark:text-white dark:placeholder:text-gray-400
            "
          />
        </div>

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="
            h-9 w-9 rounded-full
            border border-[#E4E7EC]
            flex items-center justify-center
            text-[#667085]
            hover:bg-[#E4E7EC]
            dark:border-[#1F2937]
            dark:text-gray-300 dark:hover:bg-white/10
          "
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* Notifications */}
        <button
          className="
            relative h-9 w-9 rounded-full
            border border-[#E4E7EC]
            flex items-center justify-center
            text-[#667085]
            hover:bg-[#E4E7EC]
            dark:border-[#1F2937]
            dark:text-gray-300 dark:hover:bg-white/10
          "
        >
          <Bell size={18} />
          <span
            className="
              absolute -top-1 -right-1
              h-5 w-5 rounded-full
              bg-[#EF4444]
              text-xs text-white
              flex items-center justify-center
            "
          >
            3
          </span>
        </button>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-2
              rounded-full px-2 py-1
              hover:bg-[#E4E7EC]
              dark:hover:bg-white/10
            "
          >
            <div
              className="
                h-9 w-9 rounded-full
                bg-[#3B82F6]
                text-white font-semibold
                flex items-center justify-center
              "
            >
              {user?.first_name?.[0] || <User size={16} />}
            </div>
            <span className="hidden md:block text-sm font-medium text-[#101828] dark:text-white">
              {user?.first_name}
            </span>
          </button>

          {open && (
            <div
              className="
                absolute right-0 mt-2 w-40
                rounded-xl
                bg-white dark:bg-[#101828]
                border border-[#E4E7EC] dark:border-[#1F2937]
                shadow-lg overflow-hidden
              "
            >
              <button
                onClick={logout}
                className="
                  w-full flex items-center gap-2
                  px-4 py-3 text-sm
                  text-[#EF4444]
                  hover:bg-[#FEE4E2]
                  dark:hover:bg-white/10
                "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
