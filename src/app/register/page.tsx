"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const data = await apiPost<{ user: any; token: string }>("/api/users/register/", form);
      setToken(data.token);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="font-headline text-3xl mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <Input id="username" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password_confirm" className="block mb-1">Confirm Password</label>
          <Input id="password_confirm" name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="first_name" className="block mb-1">First Name</label>
          <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="last_name" className="block mb-1">Last Name</label>
          <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full">Register</Button>
        <p className="text-center text-sm mt-2">Already have an account? <a href="/login" className="text-primary underline">Login</a></p>
      </form>
    </div>
  );
}
