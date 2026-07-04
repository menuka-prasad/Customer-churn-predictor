import { generateMetadata } from "@/lib/generate-metadata";
import { LandingPage } from '@/components/pages/LandingPage';
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description: "Predict customer churn with advanced machine learning models based on Telco datasets.",
  canonicalUrl: "/",
});

export default function Home() {
  return <LandingPage />;
}
