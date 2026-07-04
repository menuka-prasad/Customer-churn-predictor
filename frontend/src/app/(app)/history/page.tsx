import { HistoryPage } from '@/components/pages/HistoryPage';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Prediction History",
  noIndex: true,
});

export default function Page() {
  return <HistoryPage />;
}
