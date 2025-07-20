"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens, apiPost, getToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (getToken()) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (form.password !== form.password_confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      const data = await apiPost<{ access: string; refresh: string }>("/api/users/register/", form);
      if (data.access && data.refresh) {
        setTokens(data.access, data.refresh);
        // Trigger a storage event to update other components
        window.dispatchEvent(new Event('storage'));
        router.push(redirectTo);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err?.response?.data?.errors) {
        // Handle structured error responses
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(" "));
      } else {
        setError(err?.response?.data?.detail || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create Account</CardTitle>
          <CardDescription>Join us to discover authentic flavors - Every Taste Has A Story</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirm">Confirm Password</Label>
              <Input
                id="password_confirm"
                name="password_confirm"
                type="password"
                value={form.password_confirm}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Create Account</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
