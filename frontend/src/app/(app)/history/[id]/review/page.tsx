import { ReviewPage } from '@/components/pages/ReviewPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Review Prediction",
  noIndex: true,
});

export default function Page() {
  return <ReviewPage />;
}
