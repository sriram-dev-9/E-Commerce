"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login since both auth flows are now unified
    router.replace('/login');
  }, [router]);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-headline">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to sign in...</p>
      </div>
    </div>
  );
}
