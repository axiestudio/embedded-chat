'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { nanoid } from 'nanoid';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatConfig {
  id: number;
  organizationId: string;
  baseUrl: string;
  workflowId: string;
  apiKey: string;
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  welcomeMessage?: string;
  chatTitle?: string;
  placeholderText?: string;
  publicSlug: string;
  isEnabled: boolean;
}

interface ChatInterfaceProps {
  config: ChatConfig;
}

export const ChatInterface = ({ config }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => nanoid());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const primaryColor = config.primaryColor || '#3B82F6';
  const secondaryColor = config.secondaryColor || '#10B981';
  const companyName = config.companyName || 'Support';
  const chatTitle = config.chatTitle || 'Chat Support';
  const welcomeMessage = config.welcomeMessage || 'Hello! How can I help you today?';
  const placeholderText = config.placeholderText || 'Type your message here...';

  // Add welcome message on component mount
  useEffect(() => {
    if (welcomeMessage) {
      setMessages([{
        id: nanoid(),
        content: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  }, [welcomeMessage]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          configId: config.id,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const botMessage: ChatMessage = {
          id: nanoid(),
          content: result.data.response || 'I apologize, but I encountered an error processing your request.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: nanoid(),
          content: 'I apologize, but I encountered an error. Please try again later.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: nanoid(),
        content: 'I apologize, but I encountered a connection error. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[80vh] flex flex-col">
        {/* Enhanced Chat Header */}
        <div
          className="relative px-8 py-6 text-white flex items-center gap-4 shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
          }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
          <div className="relative flex items-center gap-4 flex-1">
            {config.logoUrl && (
              <div className="relative">
                <img
                  src={config.logoUrl}
                  alt={companyName}
                  className="h-12 w-12 object-cover rounded-2xl bg-white/20 p-1 shadow-lg border-2 border-white/30"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{companyName}</h1>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30 text-sm font-medium px-3 py-1 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Online
                </Badge>
              </div>
              <p className="text-lg opacity-90 flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {chatTitle}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl shadow-lg backdrop-blur-sm">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
        {/* Enhanced Welcome Message */}
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center space-y-6 max-w-md">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to {companyName}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {welcomeMessage}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-powered support ready to help</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Enhanced Avatar */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              message.isUser
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25'
                : 'bg-gradient-to-br from-teal-500 to-green-600 shadow-teal-500/25'
            }`}>
              {message.isUser ? (
                <User className="h-6 w-6 text-white" />
              ) : (
                <Bot className="h-6 w-6 text-white" />
              )}
            </div>

            {/* Enhanced Message Bubble */}
            <div className={`flex flex-col max-w-[70%] ${message.isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-6 py-4 rounded-3xl shadow-lg ${
                  message.isUser
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-lg shadow-slate-200/50 dark:shadow-slate-800/50'
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Enhanced Timestamp */}
              <div className={`flex items-center gap-2 mt-2 px-3 ${
                message.isUser ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 px-6 py-4 rounded-3xl rounded-bl-lg shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-base text-slate-600 dark:text-slate-400 font-medium">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
        <div className="flex gap-4 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              disabled={isLoading}
              className="pr-16 py-4 h-14 text-base rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm hover:shadow-md"
            />
            {inputValue.trim() && (
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm" />
              </div>
            )}
          </div>
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="h-14 w-14 rounded-3xl p-0 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              background: inputValue.trim()
                ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                : undefined
            }}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Enhanced Powered by indicator */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Powered by AI</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
