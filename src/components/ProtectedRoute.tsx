"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push(redirectTo);
    }
    setLoading(false);
  }, [router, redirectTo]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-8 w-32 mx-auto mb-4"></div>
          <div className="bg-gray-300 h-4 w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
