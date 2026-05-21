import React, { useState } from 'react';
import { CrossReferencingAgent } from '@/components/agent/CrossReferencingAgent';
import { DataSourceViewer } from '@/components/agent/DataSourceViewer';
import { AgentIntegrationSetup } from '@/components/agent/AgentIntegrationSetup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface AIAgentPageProps {
  auditId: string;
  companyName: string;
}

export function AIAgentPage({ auditId, companyName }: AIAgentPageProps) {
  const [integrationConfig, setIntegrationConfig] = useState<Record<string, any>>({});
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🤖 AI Cross-Reference Agent</h1>
        <p className="text-gray-600 mt-2">
          Intelligent compliance analysis that correlates internal documentation, code repositories, and regulatory requirements.
        </p>
      </div>

      {/* Information Alert */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          This AI agent will analyze your organization's internal documentation (Notion), code repositories (GitHub), and
          external regulatory databases (SEC EDGAR) to identify compliance gaps, inconsistencies, and risks.
        </AlertDescription>
      </Alert>

      {/* Tabs for different views */}
      <Tabs defaultValue="agent" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agent">Run Analysis</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Run Analysis Tab */}
        <TabsContent value="agent" className="space-y-6">
          <CrossReferencingAgent
            auditId={auditId}
            companyName={companyName}
            notionDatabaseId={integrationConfig.notion?.databaseId}
            githubOwner={integrationConfig.github?.owner}
            githubRepo={integrationConfig.github?.repo}
            onAnalysisComplete={(result) => setAnalysisResults(result)}
          />
        </TabsContent>

        {/* Data Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          <DataSourceViewer
            companyName={companyName}
            notionDatabaseId={integrationConfig.notion?.databaseId}
            githubOwner={integrationConfig.github?.owner}
            githubRepo={integrationConfig.github?.repo}
          />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Source Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <AgentIntegrationSetup onConfigComplete={setIntegrationConfig} />
              </div>

              {/* Configuration Display */}
              {Object.keys(integrationConfig).length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Configured Integrations</h3>
                  {integrationConfig.notion?.connected && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                      <span>✓</span>
                      <span className="text-sm">Notion connected ({integrationConfig.notion?.databaseId?.substring(0, 8)}...)</span>
                    </div>
                  )}
                  {integrationConfig.github?.connected && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                      <span>✓</span>
                      <span className="text-sm">
                        GitHub connected ({integrationConfig.github?.owner}/{integrationConfig.github?.repo})
                      </span>
                    </div>
                  )}
                  {integrationConfig.sec?.connected && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                      <span>✓</span>
                      <span className="text-sm">SEC EDGAR enabled</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {analysisResults ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded overflow-auto max-h-96">
                      {analysisResults.summary}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              {analysisResults.risks?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Identified Risks ({analysisResults.risks.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysisResults.risks.map((risk: any, idx: number) => (
                      <div key={idx} className="border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{risk.title}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                        <p className="text-xs text-gray-500 mt-2"><strong>Category:</strong> {risk.category}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No analysis results yet. Run the AI agent analysis first.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 space-y-2">
          <p>
            1. <strong>Configure Integrations:</strong> Set up connections to Notion, GitHub, and enable SEC EDGAR
          </p>
          <p>
            2. <strong>View Data Sources:</strong> Review all documents being analyzed from each source
          </p>
          <p>
            3. <strong>Run Analysis:</strong> The AI agent will cross-reference all sources to find inconsistencies and risks
          </p>
          <p>
            4. <strong>Review Results:</strong> Get recommendations prioritized by severity and impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
