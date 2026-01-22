"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "@/lib/axios";
import { Camera, Save, Building2, Mail, Phone, Globe, MapPin, BadgeCheck } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ProfileForm = {
  description: string;
  phone: string;
  address: string;
  website: string;
  type: string;
};

export default function OrganizationProfile() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    description: "",
    phone: "",
    address: "",
    website: "",
    type: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("Organization");
  const [status, setStatus] = useState<"verified" | "pending" | "rejected">("pending");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/organization/profile");
        const org = res.data.organization;
        const user = res.data.user;

        setOrgName(`${user.first_name} ${user.last_name}`);
        setStatus(org?.status || "pending");

        setForm({
          description: org?.description || "",
          phone: org?.phone || "",
          address: org?.address || "",
          website: org?.website || "",
          type: org?.type || "",
        });

        if (org?.logo)
          setLogoPreview(`http://localhost:8000/storage/${org.logo}`);
        if (org?.cover_image)
          setCoverPreview(`http://localhost:8000/storage/${org.cover_image}`);
      } catch {
        alert("Failed to load organization profile");
      }
    };
    fetchProfile();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (file: File | null) => {
    setLogo(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (file: File | null) => {
    setCoverImage(file);
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("_method", "PATCH");
    data.append("description", form.description ?? "");
    data.append("phone", form.phone ?? "");
    data.append("address", form.address ?? "");
    data.append("website", form.website ?? "");
    data.append("type", form.type ?? "");
    if (logo) data.append("logo", logo);
    if (coverImage) data.append("cover_image", coverImage);

    try {
      await axios.post("/organization/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Organization profile updated successfully");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ================= HEADER CARD ================= */}
      <div className="rounded-2xl overflow-hidden bg-[#0B1220] border border-[#1F2937]">
        <div className="relative h-40 bg-linear-to-r from-blue-500 to-blue-600">
          {coverPreview && (
            <Image
              src={coverPreview}
              alt="Cover"
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}
          <input
            type="file"
            className="absolute inset-0 opacity-0"
            onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex items-center gap-4 px-6 py-4 bg-[#101828]">
          <div className="relative w-20 h-20 rounded-full bg-[#0B1220] flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo"
                width={80}
                height={80}
                className="object-cover"
                unoptimized
              />
            ) : (
              <Building2 className="text-gray-400" />
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0"
              onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">{orgName}</h1>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-900/40 text-green-400 mt-1">
              <BadgeCheck size={12} /> {status}
            </span>
          </div>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="bg-[#101828] rounded-2xl border border-[#1F2937] p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Organization Details</h2>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl bg-[#0B1220] border border-[#1F2937] p-3 text-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2"><Mail size={14}/> Website</h3>
            <input name="website" value={form.website} onChange={handleChange} className="w-full rounded-xl bg-[#0B1220] border border-[#1F2937] p-3 text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2"><Phone size={14}/> Phone</h3>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl bg-[#0B1220] border border-[#1F2937] p-3 text-sm" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2"><MapPin size={14}/> Address</h3>
          <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-xl bg-[#0B1220] border border-[#1F2937] p-3 text-sm" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Organization Type</h3>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger className="bg-[#0B1220] border-[#1F2937]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="accelerator">Accelerator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ================= SAVE ================= */}
      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          <Save size={16} /> {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
