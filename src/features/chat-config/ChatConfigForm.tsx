'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import {
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Sparkles,
  Shield,
  Globe
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form validation schema
const chatConfigSchema = z.object({
  baseUrl: z.string().url('Please enter a valid URL').min(1, 'Base URL is required'),
  workflowId: z.string().min(1, 'Workflow ID is required'),
  apiKey: z.string().min(1, 'API Key is required'),
  testMessage: z.string().optional(),
});

type ChatConfigFormData = z.infer<typeof chatConfigSchema>;

export const ChatConfigForm = () => {
  const t = useTranslations('ChatConfig');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const form = useForm<ChatConfigFormData>({
    resolver: zodResolver(chatConfigSchema),
    defaultValues: {
      baseUrl: 'https://se.axiestudio.se/api/v1/run/',
      workflowId: '',
      apiKey: '',
      testMessage: 'Hello, this is a test message',
    },
  });

  // Load existing configuration on component mount
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const response = await fetch('/api/chat-config');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const config = result.data;
            form.reset({
              baseUrl: config.baseUrl || 'https://your-api-endpoint.com/api/v1/run/',
              workflowId: config.workflowId || '',
              apiKey: config.hasApiKey ? '••••••••••••••••' : '', // Show masked API key if exists
              testMessage: 'Hello, this is a test message',
            });
          }
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };

    loadConfiguration();
  }, [form]);

  const onSubmit = async (data: ChatConfigFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Configuration saved successfully!');
      } else {
        throw new Error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert(`Error saving configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    const values = form.getValues();

    if (!values.baseUrl || !values.workflowId || !values.apiKey) {
      alert('Please fill in all required fields before testing');
      return;
    }

    setIsLoading(true);
    setTestResult(null);
    setConnectionStatus('testing');

    try {
      const response = await fetch('/api/chat-config/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl: values.baseUrl,
          workflowId: values.workflowId,
          apiKey: values.apiKey,
          testMessage: values.testMessage || 'Hello, this is a test message',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTestResult(`✅ ${result.message}\n\nResponse: ${JSON.stringify(result.data, null, 2)}`);
        setConnectionStatus('success');
      } else {
        setTestResult(`❌ ${result.message}\n\nError: ${result.error}`);
        setConnectionStatus('error');
      }
    } catch (error) {
      setTestResult(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Enhanced Connection Status Banner */}
      {connectionStatus !== 'idle' && (
        <div className="relative">
          <Alert className={`border-0 shadow-lg ${
            connectionStatus === 'success'
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 dark:from-green-950/30 dark:to-emerald-950/30 dark:text-green-400 border-l-4 border-l-green-500'
              : connectionStatus === 'error'
              ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 dark:from-red-950/30 dark:to-rose-950/30 dark:text-red-400 border-l-4 border-l-red-500'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 dark:from-blue-950/30 dark:to-indigo-950/30 dark:text-blue-400 border-l-4 border-l-blue-500'
          } p-6 rounded-xl`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${
                connectionStatus === 'success' ? 'bg-green-100 dark:bg-green-900/50' :
                connectionStatus === 'error' ? 'bg-red-100 dark:bg-red-900/50' :
                'bg-blue-100 dark:bg-blue-900/50'
              }`}>
                {connectionStatus === 'testing' && <Loader2 className="h-5 w-5 animate-spin" />}
                {connectionStatus === 'success' && <CheckCircle className="h-5 w-5" />}
                {connectionStatus === 'error' && <AlertCircle className="h-5 w-5" />}
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-lg font-semibold">
                  {connectionStatus === 'testing' && 'Testing Connection...'}
                  {connectionStatus === 'success' && 'Connection Successful!'}
                  {connectionStatus === 'error' && 'Connection Failed'}
                </div>
                <AlertDescription className="text-base leading-relaxed">
                  {connectionStatus === 'testing' && 'Verifying your API configuration and testing connectivity...'}
                  {connectionStatus === 'success' && 'Your Axie Studio API is connected and ready to use. All systems are operational.'}
                  {connectionStatus === 'error' && 'Unable to connect to your API. Please verify your credentials and network connection.'}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-750 p-2 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
          <TabsTrigger
            value="config"
            className="flex items-center gap-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/10 rounded-xl transition-all duration-300 py-3 px-4 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50"
          >
            <Settings className="h-5 w-5" />
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="test"
            className="flex items-center gap-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/10 rounded-xl transition-all duration-300 py-3 px-4 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50"
          >
            <Zap className="h-5 w-5" />
            Test Connection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-8 mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Enhanced API Endpoint Configuration */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">API Endpoint</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Configure your Axie Studio API connection</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800 font-medium">
                    Required
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="baseUrl"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Base URL
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="https://se.axiestudio.se/api/v1/run/"
                            className="pr-12 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-base transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-600"
                            {...field}
                          />
                          <ExternalLink className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        The base URL of your API endpoint. This should include the full path to your API.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Enhanced Workflow Configuration */}
              <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-purple-200/30 dark:border-purple-800/30 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/25">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Workflow Settings</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Configure your AI workflow parameters</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800 font-medium">
                    Required
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="workflowId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Workflow ID
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="f367b858-4b93-47a2-9cc2-b6562e674ba4"
                            className="pr-12 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 rounded-xl font-mono text-base transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-600"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                            onClick={() => navigator.clipboard.writeText(field.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        Your unique workflow ID from Axie Studio. This identifies which AI workflow to use for processing messages.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Enhanced Security Configuration */}
              <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border border-green-200/30 dark:border-green-800/30 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/25">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Authentication</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Secure your API connection with authentication</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 font-medium">
                    Secure
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        API Key
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            placeholder="Your API key"
                            className="pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Your API key for authentication with Axie Studio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Configuration...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Save Configuration
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  disabled={isLoading}
                  className="flex items-center gap-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="test" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Test Your API Connection
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Send a test message to verify your Axie Studio configuration
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="testMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Test Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a test message to send to your workflow..."
                        className="min-h-[100px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                      This message will be sent to your workflow for testing
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button
                onClick={testConnection}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Send Test Message
                  </>
                )}
              </Button>

              {testResult && (
                <div className={`mt-6 p-4 rounded-xl border ${
                  testResult.includes('❌')
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50'
                    : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {testResult.includes('❌') ? (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    <h4 className={`font-semibold ${
                      testResult.includes('❌')
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-green-800 dark:text-green-200'
                    }`}>
                      Test Result
                    </h4>
                  </div>
                  <div className={`p-3 rounded-lg font-mono text-sm whitespace-pre-wrap ${
                    testResult.includes('❌')
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  }`}>
                    {testResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
