'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0047AB] to-[#0066FF] flex items-center justify-center font-bold text-white">
                S
              </div>
              <div>
                <div className="font-bold text-white text-lg">SISP</div>
                <div className="text-xs text-gray-400">INNOVATION</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sidama Innovation & Startup Portal connecting startups,
              mentors, investors, and opportunities across the region.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#startups" className="hover:text-white">Startups</Link></li>
              <li><Link href="#opportunities" className="hover:text-white">Opportunities</Link></li>
              <li><Link href="#mentorship" className="hover:text-white">Mentorship</Link></li>
              <li><Link href="#knowledge" className="hover:text-white">Knowledge Hub</Link></li>
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-white font-semibold mb-4">Organization</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-white">About SISP</Link></li>
              <li><Link href="#" className="hover:text-white">Partners</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00C9B1]" />
                Hawassa, Sidama, Ethiopia
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00C9B1]" />
                +251 900 000 000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00C9B1]" />
                info@sisp.et
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SISP Innovation Platform. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
