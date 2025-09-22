'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Copy, 
  ExternalLink, 
  Settings, 
  Eye, 
  Bot, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Loader2,
  Palette
} from 'lucide-react';

interface ChatConfig {
  id: number;
  organizationId: string;
  apiKey: string;
  workflowId: string;
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  chatTitle: string;
  welcomeMessage: string;
  placeholderText: string;
  publicSlug: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatPreviewProps {
  config?: ChatConfig | null;
  isLoading?: boolean;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ config, isLoading }) => {
  const [localConfig, setLocalConfig] = useState<ChatConfig | null>(null);
  const [localLoading, setLocalLoading] = useState(true);

  const loadConfiguration = async () => {
    if (config !== undefined) {
      setLocalConfig(config);
      setLocalLoading(false);
      return;
    }

    try {
      setLocalLoading(true);
      const response = await fetch('/api/chat-config');
      if (response.ok) {
        const data = await response.json();
        setLocalConfig(data);
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const actualLoading = isLoading !== undefined ? isLoading : localLoading;
  const actualConfig = config !== undefined ? config : localConfig;

  if (actualLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-96 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  const primaryColor = actualConfig?.primaryColor || '#3B82F6';
  const secondaryColor = actualConfig?.secondaryColor || '#10B981';
  const companyName = actualConfig?.companyName || 'Your Company';
  const chatTitle = actualConfig?.chatTitle || 'AI Assistant';
  const welcomeMessage = actualConfig?.welcomeMessage || 'Hello! How can I help you today?';
  const placeholderText = actualConfig?.placeholderText || 'Type your message here...';
  const publicUrl = actualConfig?.publicSlug ? `${window.location.origin}/chat/${actualConfig.publicSlug}` : 'Not configured';

  return (
    <div className="space-y-4 p-4">
      {/* Compact Public URL Section */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded">
            <Globe className="h-3 w-3 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">Public Chat URL</h4>
          <Badge variant={actualConfig?.isEnabled ? 'default' : 'secondary'} className="text-xs">
            {actualConfig?.isEnabled ? 'Live' : 'Off'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <code className="flex-1 p-2 bg-white dark:bg-slate-800 rounded text-xs font-mono border border-slate-200 dark:border-slate-700 truncate">
              {publicUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(publicUrl)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {actualConfig?.publicSlug && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/chat/${actualConfig.publicSlug}`, '_blank')}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!actualConfig?.publicSlug && (
              <Badge variant="outline" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Configuration needed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Compact Chat Interface Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-100 dark:bg-blue-900/50 rounded">
            <Eye className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Live Preview</h4>
          <Badge variant="secondary" className="text-xs">Mini</Badge>
        </div>

        {/* Compact Chat Interface Preview */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Compact Chat Header */}
          <div
            className="relative p-3 text-white flex items-center gap-2 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
            }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center gap-2 flex-1 min-w-0">
              {actualConfig?.logoUrl && (
                <div className="relative flex-shrink-0">
                  <img
                    src={actualConfig.logoUrl}
                    alt={companyName}
                    className="h-6 w-6 object-cover rounded bg-white/20"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-medium text-xs truncate">{companyName}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs px-1 py-0">
                    <CheckCircle2 className="h-2 w-2" />
                  </Badge>
                </div>
                <p className="text-xs opacity-90 flex items-center gap-1 truncate">
                  <Bot className="h-2 w-2 flex-shrink-0" />
                  {chatTitle}
                </p>
              </div>
              <div className="p-1 bg-white/20 rounded-full flex-shrink-0">
                <Sparkles className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Compact Chat Messages Area */}
          <div className="p-3 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 h-48 space-y-2 overflow-hidden">
            {/* Compact Welcome Message */}
            <div className="flex items-start gap-1">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center">
                <Bot className="h-2 w-2 text-white" />
              </div>
              <div className="flex flex-col max-w-[80%]">
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg rounded-bl-sm shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-900 dark:text-slate-100 line-clamp-2">{welcomeMessage}</p>
                </div>
              </div>
            </div>

            {/* Compact User Message */}
            <div className="flex items-start gap-1 flex-row-reverse">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-2 w-2 text-white" />
              </div>
              <div className="flex flex-col max-w-[80%] items-end">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-2 py-1 rounded-lg rounded-br-sm shadow-sm">
                  <p className="text-xs">Hello, I need help</p>
                </div>
              </div>
            </div>

            {/* Compact Bot Response */}
            <div className="flex items-start gap-1">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center">
                <Bot className="h-2 w-2 text-white" />
              </div>
              <div className="flex flex-col max-w-[80%]">
                <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg rounded-bl-sm shadow-sm border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-900 dark:text-slate-100 line-clamp-2">I'd be happy to help you! How can I assist?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Chat Input */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-1 items-center">
              <div className="flex-1 relative">
                <Input
                  placeholder={placeholderText}
                  className="text-xs py-1 h-6 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  disabled
                />
              </div>
              <Button
                size="sm"
                className="h-6 w-6 rounded-lg p-0 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                }}
                disabled
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center justify-center mt-2">
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Sparkles className="h-2 w-2" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md">
            <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">Configuration Status</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">API Configuration</span>
            </div>
            <Badge variant={actualConfig ? 'default' : 'secondary'} className="text-xs">
              {actualConfig ? 'Configured' : 'Pending'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Branding</span>
            </div>
            <Badge variant={actualConfig?.companyName ? 'default' : 'secondary'} className="text-xs">
              {actualConfig?.companyName ? 'Custom' : 'Default'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Public Access</span>
            </div>
            <Badge variant={actualConfig?.publicSlug ? 'default' : 'secondary'} className="text-xs">
              {actualConfig?.publicSlug ? 'Available' : 'Not available'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
            </div>
            <Badge variant={actualConfig?.isEnabled ? 'default' : 'secondary'} className="text-xs">
              {actualConfig?.isEnabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
