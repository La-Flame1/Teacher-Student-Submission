import { getApiDocs } from '@/lib/swagger'; // Adjust path if lib is elsewhere
import ReactSwagger from './react-swagger';

export default async function ApiDocPage() {
  const spec = await getApiDocs();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">API Documentation</h1>
      <ReactSwagger spec={spec} />
    </div>
  );
}