import { SignupPage } from '@/components/pages/auth/SignupPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Sign Up",
  description: "Create a new Churnly account and start predicting customer churn.",
  canonicalUrl: "/signup",
});

export default function Page() {
  return <SignupPage />;
}
