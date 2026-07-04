import { PredictPage } from '@/components/pages/PredictPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "New Prediction",
  noIndex: true,
});

export default function Page() {
  return <PredictPage />;
}
