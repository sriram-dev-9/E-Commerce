"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPut, getToken, removeTokens } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    apiGet<any>("/api/users/profile/")
      .then((data) => {
        setUser(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || ""
        });
      })
      .catch((err) => {
        console.error("Profile loading error:", err);
        if (err?.response?.status === 401) {
          // Token might be invalid or expired
          removeTokens();
          router.push("/login");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const data = await apiPut<{ status: string; user: any }>("/api/users/profile/", form);
      setUser(data.user);
      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      console.error("Profile update error:", err);
      if (err?.response?.data?.errors) {
        // Handle structured error responses
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(" "));
      } else {
        setError(err?.response?.data?.detail || "Update failed. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    removeTokens();
    router.push("/login");
  };

  if (loading) return <div className="container mx-auto px-4 py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="font-headline text-3xl mb-6 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="first_name" className="block mb-1">First Name</label>
          <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="last_name" className="block mb-1">Last Name</label>
          <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <Button type="submit" className="w-full">Update Profile</Button>
      </form>
      <Button variant="outline" className="w-full mt-6" onClick={handleLogout}>Logout</Button>
    </div>
  );
}
