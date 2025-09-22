'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import {
  Palette,
  Image,
  Type,
  MessageCircle,
  Sparkles,
  CheckCircle,
  Loader2,
  Upload,
  Eye,
  Wand2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form validation schema
const brandingConfigSchema = z.object({
  companyName: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color').optional().or(z.literal('')),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color').optional().or(z.literal('')),
  welcomeMessage: z.string().optional(),
  chatTitle: z.string().optional(),
  placeholderText: z.string().optional(),
});

type BrandingConfigFormData = z.infer<typeof brandingConfigSchema>;

export const BrandingConfigForm = () => {
  const t = useTranslations('ChatConfig');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BrandingConfigFormData>({
    resolver: zodResolver(brandingConfigSchema),
    defaultValues: {
      companyName: '',
      logoUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      welcomeMessage: 'Hello! How can I help you today?',
      chatTitle: 'Chat Support',
      placeholderText: 'Type your message here...',
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
              companyName: config.companyName || '',
              logoUrl: config.logoUrl || '',
              primaryColor: config.primaryColor || '#3B82F6',
              secondaryColor: config.secondaryColor || '#10B981',
              welcomeMessage: config.welcomeMessage || 'Hello! How can I help you today?',
              chatTitle: config.chatTitle || 'Chat Support',
              placeholderText: config.placeholderText || 'Type your message here...',
            });
          }
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };

    loadConfiguration();
  }, [form]);

  const onSubmit = async (data: BrandingConfigFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Branding configuration saved successfully!');
      } else {
        throw new Error(result.error || 'Failed to save branding configuration');
      }
    } catch (error) {
      console.error('Error saving branding configuration:', error);
      alert(`Error saving branding configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Branding & Design
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Customize the appearance and messaging of your chat interface
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger
                  value="identity"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  <Image className="h-4 w-4" />
                  Identity
                </TabsTrigger>
                <TabsTrigger
                  value="colors"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  <Palette className="h-4 w-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger
                  value="messaging"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Messaging
                </TabsTrigger>
              </TabsList>

              <TabsContent value="identity" className="space-y-6 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                      <Image className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Company Identity</h3>
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Your Company Name"
                                className="pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20"
                                {...field}
                              />
                              <Type className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            This will be displayed in the chat interface header
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Logo URL
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="https://example.com/logo.png"
                                className="pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20"
                                {...field}
                              />
                              <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            URL to your company logo (recommended size: 200x50px)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-6 mt-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Color Scheme</h3>
                    <Badge variant="secondary" className="text-xs">Customizable</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Primary Color
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <div className="relative">
                                  <Input
                                    type="color"
                                    className="w-16 h-12 p-1 rounded-lg border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                                    {...field}
                                  />
                                </div>
                                <Input
                                  placeholder="#3B82F6"
                                  className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 font-mono"
                                  {...field}
                                />
                              </div>
                              <div
                                className="h-8 rounded-lg border border-slate-200 dark:border-slate-700"
                                style={{ backgroundColor: field.value || '#3B82F6' }}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Main brand color for buttons and highlights
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Secondary Color
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <div className="relative">
                                  <Input
                                    type="color"
                                    className="w-16 h-12 p-1 rounded-lg border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                                    {...field}
                                  />
                                </div>
                                <Input
                                  placeholder="#10B981"
                                  className="flex-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 font-mono"
                                  {...field}
                                />
                              </div>
                              <div
                                className="h-8 rounded-lg border border-slate-200 dark:border-slate-700"
                                style={{ backgroundColor: field.value || '#10B981' }}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Secondary color for accents and borders
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Color Presets */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Quick Presets</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { primary: '#3B82F6', secondary: '#10B981', name: 'Ocean' },
                        { primary: '#8B5CF6', secondary: '#EC4899', name: 'Sunset' },
                        { primary: '#F59E0B', secondary: '#EF4444', name: 'Fire' },
                        { primary: '#059669', secondary: '#0891B2', name: 'Forest' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          onClick={() => {
                            form.setValue('primaryColor', preset.primary);
                            form.setValue('secondaryColor', preset.secondary);
                          }}
                        >
                          <div className="flex gap-1">
                            <div
                              className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700"
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="messaging" className="space-y-6 mt-6">
                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20 rounded-xl p-6 border border-teal-200/50 dark:border-teal-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-teal-100 dark:bg-teal-900/50 rounded-md">
                      <MessageCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Chat Interface Text</h3>
                    <Badge variant="secondary" className="text-xs">Personalize</Badge>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="chatTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Chat Title
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Chat Support"
                                className="pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/20"
                                {...field}
                              />
                              <Type className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Title displayed at the top of the chat interface
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="welcomeMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Welcome Message
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Hello! How can I help you today?"
                                className="min-h-[100px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/20 resize-none"
                                {...field}
                              />
                              <Sparkles className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            First message shown to users when they open the chat
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="placeholderText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Input Placeholder
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Type your message here..."
                                className="pr-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-teal-500/20"
                                {...field}
                              />
                              <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Placeholder text shown in the message input field
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Message Templates */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Quick Templates</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { title: 'Professional', welcome: 'Welcome! How may I assist you today?', placeholder: 'Please describe your inquiry...' },
                          { title: 'Friendly', welcome: 'Hi there! 👋 What can I help you with?', placeholder: 'Type your message here...' },
                          { title: 'Technical', welcome: 'Hello! I\'m here to help with your technical questions.', placeholder: 'Describe your technical issue...' },
                        ].map((template) => (
                          <button
                            key={template.title}
                            type="button"
                            className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => {
                              form.setValue('welcomeMessage', template.welcome);
                              form.setValue('placeholderText', template.placeholder);
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Wand2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{template.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{template.welcome}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Save Branding Configuration
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
