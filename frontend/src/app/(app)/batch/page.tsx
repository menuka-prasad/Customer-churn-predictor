import { BatchPredictPage } from '@/components/pages/BatchPredictPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Batch Prediction",
  noIndex: true,
});

export default function Page() {
  return <BatchPredictPage />;
}
