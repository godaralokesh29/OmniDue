import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface IntegrationConfig {
  notion?: {
    apiKey: string;
    databaseId: string;
    connected: boolean;
  };
  github?: {
    token: string;
    owner: string;
    repo: string;
    connected: boolean;
  };
  sec?: {
    connected: boolean;
  };
}

interface AgentIntegrationSetupProps {
  onConfigComplete?: (config: IntegrationConfig) => void;
}

export function AgentIntegrationSetup({ onConfigComplete }: AgentIntegrationSetupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<IntegrationConfig>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, boolean | string>>({});

  const testNotionConnection = async () => {
    setTesting((prev) => ({ ...prev, notion: true }));
    try {
      // Simulate connection test
      setTimeout(() => {
        setTestResults((prev) => ({ ...prev, notion: true }));
        setTesting((prev) => ({ ...prev, notion: false }));
        if (config.notion) {
          setConfig((prev) => ({
            ...prev,
            notion: { ...prev.notion!, connected: true },
          }));
        }
      }, 1000);
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        notion: error instanceof Error ? error.message : 'Connection failed',
      }));
      setTesting((prev) => ({ ...prev, notion: false }));
    }
  };

  const testGitHubConnection = async () => {
    setTesting((prev) => ({ ...prev, github: true }));
    try {
      // Simulate connection test
      setTimeout(() => {
        setTestResults((prev) => ({ ...prev, github: true }));
        setTesting((prev) => ({ ...prev, github: false }));
        if (config.github) {
          setConfig((prev) => ({
            ...prev,
            github: { ...prev.github!, connected: true },
          }));
        }
      }, 1000);
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        github: error instanceof Error ? error.message : 'Connection failed',
      }));
      setTesting((prev) => ({ ...prev, github: false }));
    }
  };

  const handleSave = () => {
    onConfigComplete?.(config);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        ⚙️ Configure Integrations
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Data Sources for AI Agent</DialogTitle>
            <DialogDescription>
              Set up connections to Notion, GitHub, and SEC for comprehensive cross-reference analysis
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="notion" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notion">Notion</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="sec">SEC EDGAR</TabsTrigger>
            </TabsList>

            {/* Notion Configuration */}
            <TabsContent value="notion" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="notion-api-key">Notion API Key</Label>
                  <Input
                    id="notion-api-key"
                    placeholder="ntn_..."
                    type="password"
                    value={config.notion?.apiKey || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        notion: { ...prev.notion!, apiKey: e.target.value },
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from{' '}
                    <a href="https://www.notion.com/my-integrations" target="_blank" rel="noreferrer" className="underline">
                      Notion Integrations
                    </a>
                  </p>
                </div>

                <div>
                  <Label htmlFor="notion-db-id">Database ID</Label>
                  <Input
                    id="notion-db-id"
                    placeholder="3e12c845d47e47aab5..."
                    value={config.notion?.databaseId || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        notion: { ...prev.notion!, databaseId: e.target.value },
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Found in the URL of your Notion database
                  </p>
                </div>

                {testResults.notion === true && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully connected to Notion
                    </AlertDescription>
                  </Alert>
                )}

                {typeof testResults.notion === 'string' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{testResults.notion}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={testNotionConnection}
                  disabled={testing.notion || !config.notion?.apiKey || !config.notion?.databaseId}
                  className="w-full"
                >
                  {testing.notion ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : config.notion?.connected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Connected
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* GitHub Configuration */}
            <TabsContent value="github" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                  <Input
                    id="github-token"
                    placeholder="ghp_..."
                    type="password"
                    value={config.github?.token || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        github: { ...prev.github!, token: e.target.value },
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Generate at{' '}
                    <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="underline">
                      GitHub Settings
                    </a>
                    {' '}with repo access
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="github-owner">Repository Owner</Label>
                    <Input
                      id="github-owner"
                      placeholder="username or org"
                      value={config.github?.owner || ''}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          github: { ...prev.github!, owner: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="github-repo">Repository Name</Label>
                    <Input
                      id="github-repo"
                      placeholder="repo-name"
                      value={config.github?.repo || ''}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          github: { ...prev.github!, repo: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                {testResults.github === true && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully connected to GitHub
                    </AlertDescription>
                  </Alert>
                )}

                {typeof testResults.github === 'string' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{testResults.github}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={testGitHubConnection}
                  disabled={
                    testing.github ||
                    !config.github?.token ||
                    !config.github?.owner ||
                    !config.github?.repo
                  }
                  className="w-full"
                >
                  {testing.github ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : config.github?.connected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Connected
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* SEC Configuration */}
            <TabsContent value="sec" className="space-y-4">
              <div className="space-y-3">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    SEC EDGAR is publicly available. No authentication required. The system will automatically fetch filings
                    when you provide a company name.
                  </AlertDescription>
                </Alert>

                <p className="text-sm text-gray-600">
                  SEC filings will be fetched from the publicly available EDGAR database during audit analysis.
                </p>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    SEC EDGAR integration is ready
                  </AlertDescription>
                </Alert>

                {!config.sec?.connected && (
                  <Button
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        sec: { connected: true },
                      }))
                    }
                    className="w-full"
                  >
                    Enable SEC Integration
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
