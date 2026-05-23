'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Integration {
  id: string;
  company_name: string;
  display_name: string;
  notion_api_key?: string;
  notion_database_id?: string;
  notion_connected: boolean;
  github_token?: string;
  github_owner?: string;
  github_repo?: string;
  github_connected: boolean;
  openai_api_key?: string;
  openai_connected: boolean;
  is_active: boolean;
  created_at: string;
}

interface IntegrationFormData {
  company_name: string;
  display_name: string;
  notion_api_key: string;
  notion_database_id: string;
  github_token: string;
  github_owner: string;
  github_repo: string;
  openai_api_key: string;
}

export function IntegrationSettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUserId(data.user.id);
        } else {
          console.warn('No user found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setLoading(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchIntegrations();
    } else if (!authLoading) {
      // If auth is done but no userId, stop loading
      setLoading(false);
    }
  }, [userId, authLoading]);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/user/integrations', {
        headers: {
          'x-user-id': userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.data);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (integrationId: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/user/integrations?id=${integrationId}`,
        {
          method: 'DELETE',
          headers: {
            'x-user-id': userId,
          },
        }
      );

      if (response.ok) {
        setIntegrations(integrations.filter(i => i.id !== integrationId));
        setSelectedIntegration(null);
      }
    } catch (error) {
      console.error('Error deleting integration:', error);
    }
  };

  const handleTestConnection = async (integrationId: string, source: string) => {
    setTesting((prev) => ({ ...prev, [`${integrationId}-${source}`]: true }));

    try {
      const response = await fetch('/api/user/integrations/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          integration_id: integrationId,
          source,
        }),
      });

      const data = await response.json();
      setTestResults((prev) => ({
        ...prev,
        [`${integrationId}-${source}`]: data,
      }));

      if (data.success) {
        // Refresh integrations to show updated status
        fetchIntegrations();
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setTestResults((prev) => ({
        ...prev,
        [`${integrationId}-${source}`]: {
          success: false,
          message: 'Failed to test connection',
        },
      }));
    } finally {
      setTesting((prev) => ({ ...prev, [`${integrationId}-${source}`]: false }));
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Integration Settings</h1>
        <Button onClick={() => {
          setSelectedIntegration(null);
          setShowForm(!showForm);
        }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Integration
        </Button>
      </div>

      {/* Existing Integrations */}
      <div className="grid gap-4">
        {integrations.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No integrations configured yet. Add one to get started.
            </AlertDescription>
          </Alert>
        ) : (
          integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onSelect={() => {
                setSelectedIntegration(integration);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(integration.id)}
              onTest={(source) => handleTestConnection(integration.id, source)}
              testing={testing}
              testResults={testResults}
            />
          ))
        )}
      </div>

      {/* Integration Form */}
      {showForm && (
        <IntegrationForm
          integration={selectedIntegration}
          userId={userId}
          onSave={() => {
            fetchIntegrations();
            setShowForm(false);
            setSelectedIntegration(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setSelectedIntegration(null);
          }}
        />
      )}
    </div>
  );
}

interface IntegrationCardProps {
  integration: Integration;
  onSelect: () => void;
  onDelete: () => void;
  onTest: (source: string) => void;
  testing: Record<string, boolean>;
  testResults: Record<string, any>;
}

function IntegrationCard({
  integration,
  onSelect,
  onDelete,
  onTest,
  testing,
  testResults,
}: IntegrationCardProps) {
  const sources = ['notion', 'github', 'openai'];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{integration.display_name}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Created {new Date(integration.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Source Status */}
        <div className="grid grid-cols-3 gap-3">
          {sources.map((source) => {
            const isConnected = integration[`${source}_connected` as keyof Integration];
            const testKey = `${integration.id}-${source}`;
            const testResult = testResults[testKey];
            const isTesting = testing[testKey];

            return (
              <div
                key={source}
                className="border rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold capitalize text-sm">{source}</span>
                  {isConnected ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTest(source)}
                  disabled={isTesting}
                  className="w-full text-xs"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test'
                  )}
                </Button>

                {testResult && (
                  <Alert className={testResult.success ? 'bg-green-50' : 'bg-red-50'}>
                    <AlertDescription className="text-xs">
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <Button onClick={onSelect} className="w-full">
          Edit Configuration
        </Button>
      </CardContent>
    </Card>
  );
}

interface IntegrationFormProps {
  integration: Integration | null;
  userId: string;
  onSave: () => void;
  onCancel: () => void;
}

function IntegrationForm({
  integration,
  userId,
  onSave,
  onCancel,
}: IntegrationFormProps) {
  const [formData, setFormData] = useState<IntegrationFormData>({
    company_name: integration?.company_name || '',
    display_name: integration?.display_name || '',
    notion_api_key: '',
    notion_database_id: integration?.notion_database_id || '',
    github_token: '',
    github_owner: integration?.github_owner || '',
    github_repo: integration?.github_repo || '',
    openai_api_key: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!userId) {
        setError('User not authenticated');
        setSaving(false);
        return;
      }

      const response = await fetch('/api/user/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          integration_id: integration?.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(`Server error: ${response.status}`);
        console.error('API Response:', text);
        setSaving(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        onSave();
      } else {
        setError(data.error || 'Failed to save integration');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {integration ? 'Edit Integration' : 'Add New Integration'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Company Information</h3>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="My Company Inc."
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                name="display_name"
                placeholder="My Company (Dev)"
                value={formData.display_name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Notion */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">Notion Integration (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="notion_api_key">API Key</Label>
              <Input
                id="notion_api_key"
                name="notion_api_key"
                type="password"
                placeholder="ntn_..."
                value={formData.notion_api_key}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Get your API key from{' '}
                <a
                  href="https://www.notion.com/my-integrations"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Notion Integrations
                </a>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notion_database_id">Database ID</Label>
              <Input
                id="notion_database_id"
                name="notion_database_id"
                placeholder="367891a752bc809da45fe59ee29da1c4"
                value={formData.notion_database_id}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Found in the URL of your Notion database (alphanumeric part only)
              </p>
            </div>
          </div>

          {/* GitHub */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">GitHub Integration (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="github_token">Personal Access Token</Label>
              <Input
                id="github_token"
                name="github_token"
                type="password"
                placeholder="ghp_..."
                value={formData.github_token}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Generate at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  GitHub Settings
                </a>
                {' '}with repo access
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="github_owner">Repository Owner</Label>
                <Input
                  id="github_owner"
                  name="github_owner"
                  placeholder="username or org"
                  value={formData.github_owner}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_repo">Repository Name</Label>
                <Input
                  id="github_repo"
                  name="github_repo"
                  placeholder="repo-name"
                  value={formData.github_repo}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* OpenAI */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">OpenAI Integration (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="openai_api_key">API Key</Label>
              <Input
                id="openai_api_key"
                name="openai_api_key"
                type="password"
                placeholder="sk_..."
                value={formData.openai_api_key}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">
                Get your key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  OpenAI API Keys
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Integration'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
