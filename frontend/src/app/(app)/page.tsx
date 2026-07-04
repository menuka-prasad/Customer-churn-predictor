import { redirect } from 'next/navigation';
import { generateMetadata } from "@/lib/generate-metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "Dashboard",
  noIndex: true,
});

export default function AppPage() {
  redirect('/app/predict');
}
