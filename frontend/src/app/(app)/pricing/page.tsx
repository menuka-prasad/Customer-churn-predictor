import { PricingPage } from '@/components/pages/PricingPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Pricing",
  description: "Flexible pricing plans for Churnly. Predict customer churn at any scale.",
  canonicalUrl: "/pricing",
});

export default function Page() {
  return <PricingPage />;
}
