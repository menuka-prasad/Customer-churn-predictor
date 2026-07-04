import { AnalysisPage } from '@/components/pages/AnalysisPage';
import { generateMetadata as getSeoMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return getSeoMetadata({
    title: `Prediction ${id}`,
    noIndex: true,
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to extract the ID
  const { id } = await params;

  // Pass the extracted ID to your client-side Analysis component
  return <AnalysisPage id={id} />;
}