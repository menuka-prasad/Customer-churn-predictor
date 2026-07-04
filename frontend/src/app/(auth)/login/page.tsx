import { Suspense } from 'react';
import { LoginPage } from '@/components/pages/auth/LoginPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Login",
  description: "Log in to your Churnly account to predict customer churn.",
  canonicalUrl: "/login",
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}