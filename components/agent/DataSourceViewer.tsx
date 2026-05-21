import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Code2, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';

interface SourceData {
  sources: string[];
  documentCount: number;
  details: Record<string, any[]>;
}

interface RegulatoryChecklists {
  regulations: string[];
  requirementCounts: Record<string, number>;
}

interface DataSourceViewerProps {
  companyName: string;
  notionDatabaseId?: string;
  githubOwner?: string;
  githubRepo?: string;
}

const sourceIcons: Record<string, React.ReactNode> = {
  notion: <FileText className="w-4 h-4" />,
  github: <Code2 className="w-4 h-4" />,
  sec: <FileJson className="w-4 h-4" />,
};

export function DataSourceViewer({
  companyName,
  notionDatabaseId,
  githubOwner,
  githubRepo,
}: DataSourceViewerProps) {
  const [loading, setLoading] = useState(false);
  const [sourceData, setSourceData] = useState<SourceData | null>(null);
  const [checklists, setChecklists] = useState<RegulatoryChecklists | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analysis/fetch-sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          notionDatabaseId,
          githubOwner,
          githubRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sources');
      }

      const data = await response.json();
      setSourceData(data.data.documents);
      setChecklists(data.data.regulatoryChecklists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📊 Data Sources</span>
            <Button onClick={fetchSources} disabled={loading} size="sm">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Sources'
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {sourceData && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
                <TabsTrigger value="regulations">Regulations</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-blue-600">{sourceData.documentCount}</div>
                    <div className="text-xs text-gray-600">Total Documents</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-green-600">{sourceData.sources.length}</div>
                    <div className="text-xs text-gray-600">Sources</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-purple-600">{checklists?.regulations.length || 0}</div>
                    <div className="text-xs text-gray-600">Regulations</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Object.values(checklists?.requirementCounts || {}).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Requirements</div>
                  </div>
                </div>
              </TabsContent>

              {/* Sources Tab */}
              <TabsContent value="sources" className="space-y-3">
                {sourceData.sources.map((source) => {
                  const docs = sourceData.details[source] || [];
                  return (
                    <div key={source} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        {sourceIcons[source]}
                        <h4 className="font-semibold capitalize">{source}</h4>
                        <Badge variant="outline">{docs.length} documents</Badge>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {docs.slice(0, 5).map((doc: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                            <span className="break-words">{doc.title || doc.id}</span>
                          </li>
                        ))}
                        {docs.length > 5 && (
                          <li className="text-xs text-gray-500 italic">
                            +{docs.length - 5} more documents
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </TabsContent>

              {/* Regulations Tab */}
              <TabsContent value="regulations" className="space-y-3">
                {checklists?.regulations.map((regulation) => (
                  <div key={regulation} className="border rounded-lg p-3 flex items-center justify-between">
                    <span className="font-medium">{regulation}</span>
                    <Badge>
                      {checklists.requirementCounts[regulation] || 0} requirements
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
