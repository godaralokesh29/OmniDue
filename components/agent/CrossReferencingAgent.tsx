import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface AgentState {
  status: 'idle' | 'loading' | 'streaming' | 'complete' | 'error';
  progress: number;
  currentStep: string;
  error?: string;
}

interface CrossReferencingAgentProps {
  auditId: string;
  companyName: string;
  notionDatabaseId?: string;
  githubOwner?: string;
  githubRepo?: string;
  onAnalysisComplete?: (result: any) => void;
}

export function CrossReferencingAgent({
  auditId,
  companyName,
  notionDatabaseId,
  githubOwner,
  githubRepo,
  onAnalysisComplete,
}: CrossReferencingAgentProps) {
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    progress: 0,
    currentStep: 'Ready to start analysis',
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const startAnalysis = useCallback(async () => {
    setAgentState({
      status: 'streaming',
      progress: 0,
      currentStep: 'Initializing agent...',
    });

    try {
      const response = await fetch('/api/analysis/cross-reference-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditId,
          companyName,
          notionDatabaseId,
          githubOwner,
          githubRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.status === 'progress') {
                setAgentState({
                  status: 'streaming',
                  progress: data.progress || 0,
                  currentStep: data.currentStep || 'Processing...',
                });
              } else if (data.status === 'complete') {
                setAnalysisResult(data.data);
                setAgentState({
                  status: 'complete',
                  progress: 100,
                  currentStep: 'Analysis complete',
                });
                onAnalysisComplete?.(data.data);
              } else if (data.status === 'error') {
                setAgentState({
                  status: 'error',
                  progress: agentState.progress,
                  currentStep: agentState.currentStep,
                  error: data.error,
                });
              }
            } catch (e) {
              // Parse error, skip
            }
          }
        }
      }
    } catch (error) {
      setAgentState({
        status: 'error',
        progress: agentState.progress,
        currentStep: agentState.currentStep,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }, [auditId, companyName, notionDatabaseId, githubOwner, githubRepo, onAnalysisComplete]);

  const resetAnalysis = useCallback(() => {
    setAgentState({
      status: 'idle',
      progress: 0,
      currentStep: 'Ready to start analysis',
    });
    setAnalysisResult(null);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Agent Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🤖 AI Cross-Reference Agent</span>
            {agentState.status === 'streaming' && <Loader2 className="w-5 h-5 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Information */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">{agentState.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${agentState.progress}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="flex items-center gap-2 text-sm">
            {agentState.status === 'streaming' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {agentState.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {agentState.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
            <span className="font-medium">{agentState.currentStep}</span>
          </div>

          {/* Error Alert */}
          {agentState.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{agentState.error}</AlertDescription>
            </Alert>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={startAnalysis}
              disabled={agentState.status === 'streaming'}
              className="flex-1"
            >
              {agentState.status === 'streaming' ? 'Analysis Running...' : 'Start Cross-Reference Analysis'}
            </Button>
            {agentState.status === 'complete' && (
              <Button onClick={resetAnalysis} variant="outline" className="flex-1">
                Run Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 p-3 rounded">
                    <div className="text-2xl font-bold text-red-600">{analysisResult.risks?.length || 0}</div>
                    <div className="text-xs text-gray-600">Identified Risks</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="text-2xl font-bold text-yellow-600">{analysisResult.inconsistencies?.length || 0}</div>
                    <div className="text-xs text-gray-600">Inconsistencies</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResult.correlations?.filter((c: any) => c.status === 'aligned')?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Aligned Areas</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">{analysisResult.confidence || 0}%</div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Risks */}
          {analysisResult.risks?.some((r: any) => r.severity === 'critical') && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisResult.risks
                  ?.filter((r: any) => r.severity === 'critical')
                  ?.map((risk: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-3 py-2">
                      <div className="font-semibold text-sm">{risk.title}</div>
                      <div className="text-xs text-gray-700 mt-1">{risk.description}</div>
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>Impact:</strong> {risk.potentialImpact}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Top Recommendations */}
          {analysisResult.recommendations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Priority Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysisResult.recommendations
                  ?.filter((r: any) => r.priority === 'critical' || r.priority === 'high')
                  ?.slice(0, 5)
                  ?.map((rec: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={rec.priority === 'critical' ? 'destructive' : 'default'}>
                          {rec.priority}
                        </Badge>
                        <span className="text-sm font-semibold">{rec.title}</span>
                      </div>
                      <div className="text-sm text-gray-600">{rec.description}</div>
                      {rec.actionItems?.length > 0 && (
                        <div className="text-xs space-y-1 mt-2">
                          <strong>Actions:</strong>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            {rec.actionItems.slice(0, 3).map((action: string, aidx: number) => (
                              <li key={aidx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
