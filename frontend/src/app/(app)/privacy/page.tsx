import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for Churnly. Learn how we handle and protect your data.",
  canonicalUrl: "/privacy",
});

export default function Page() {
  return <PrivacyPage />;
}
