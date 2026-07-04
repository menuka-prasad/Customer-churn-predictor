import { TermsPage } from '@/components/pages/TermsPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Terms of Service",
  description: "Terms of Service for using Churnly.",
  canonicalUrl: "/terms",
});

export default function Page() {
  return <TermsPage />;
}
