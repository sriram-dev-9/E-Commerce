"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiPost<{ user: any; token: string }>("/api/users/login/", { username, password });
      setToken(data.token);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="font-headline text-3xl mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full">Login</Button>
        <p className="text-center text-sm mt-2">Don't have an account? <a href="/register" className="text-primary underline">Register</a></p>
      </form>
    </div>
  );
}
