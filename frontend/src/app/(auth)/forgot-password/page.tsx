import { ForgotPasswordPage } from '@/components/pages/auth/ForgotPasswordPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Forgot Password",
  description: "Reset your Churnly account password.",
  canonicalUrl: "/forgot-password",
});

export default function Page() {
  return <ForgotPasswordPage />;
}
