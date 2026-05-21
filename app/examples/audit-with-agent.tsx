import { AIAgentPage } from '@/components/agent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example implementation of AI Agent on audit page
export default function ExampleAuditPage() {
  const auditId = 'AUD-001'; // This would come from route params in real app
  const companyName = 'TechCorp Inc.'; // This would come from database

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Audit Header */}
        <div className="bg-white border-b">
          <div className="p-6">
            <h1 className="text-3xl font-bold">{companyName}</h1>
            <p className="text-gray-600 mt-1">Audit ID: {auditId}</p>
          </div>
        </div>

        {/* Main Content */}
        <AIAgentPage auditId={auditId} companyName={companyName} />
      </div>
    </div>
  );
}
