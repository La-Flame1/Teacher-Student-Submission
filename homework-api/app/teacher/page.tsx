import TeacherDashboard from '@/app/components/TeacherDashboard';

// Mark the page async so we can await searchParams
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {

  const resolvedParams = await searchParams;

  // Convert to simple string record (so the client component can safely use it)
  const initialFilters = Object.fromEntries(
    Object.entries(resolvedParams || {}).map(([k, v]) => [k, String(v ?? '')])
  );

  return <TeacherDashboard initialFilters={initialFilters} />;
}
