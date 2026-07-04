import { ResetPasswordPage } from '@/components/pages/auth/ResetPasswordPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Reset Password",
  description: "Set a new password for your Churnly account.",
  canonicalUrl: "/reset-password",
});

export default function Page() {
  return <ResetPasswordPage />;
}
