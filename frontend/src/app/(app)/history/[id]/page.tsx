import { AnalysisPage } from '@/components/pages/AnalysisPage';


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to extract the ID
  const { id } = await params;

  // Pass the extracted ID to your client-side Analysis component
  return <AnalysisPage id={id} />;
}