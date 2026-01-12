'use client';

import { useRouter } from 'next/navigation';

const roles = [
  { key: 'startup', label: 'Startup' },
  { key: 'mentor', label: 'Mentor' },
  { key: 'organization', label: 'Organization' },
  { key: 'guest', label: 'Guest' },
];

export default function RolePage() {
  const router = useRouter();

  const selectRole = (role: string) => {
    router.push(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#050B1E] to-[#020617]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
        {roles.map(role => (
          <button
            key={role.key}
            onClick={() => selectRole(role.key)}
            className="bg-[#0B1229] border border-[#1E293B] rounded-xl p-6 text-white hover:border-blue-500 transition"
          >
            <h2 className="text-xl font-semibold">{role.label}</h2>
          </button>
        ))}
      </div>
    </div>
  );
}
