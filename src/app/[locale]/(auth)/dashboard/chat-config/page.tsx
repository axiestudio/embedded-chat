import { useTranslations } from 'next-intl';
import { Sparkles, MessageSquare, Palette, Eye, Zap, Shield, Globe } from 'lucide-react';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { ChatConfigForm } from '@/features/chat-config/ChatConfigForm';
import { BrandingConfigForm } from '@/features/chat-config/BrandingConfigForm';
import { ChatPreview } from '@/features/chat-config/ChatPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ChatConfigPage = () => {
  const t = useTranslations('ChatConfig');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Enhanced Hero Header */}
      <div className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 via-purple-600/8 to-teal-600/8" />
        <div className="relative">
          <TitleBar
            title={
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-teal-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-teal-500 p-4 rounded-2xl shadow-2xl shadow-blue-500/25">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight">
                    {t('title_bar')}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 px-3 py-1">
                      <Zap className="h-4 w-4 mr-2" />
                      AI-Powered
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-300 px-3 py-1">
                      <Shield className="h-4 w-4 mr-2" />
                      Enterprise Ready
                    </Badge>
                  </div>
                </div>
              </div>
            }
            description={
              <div className="space-y-4 mt-6">
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {t('title_bar_description')}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 rounded-full border border-green-200 dark:border-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">System Active</span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Ready for configuration
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-12 space-y-12">
        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 dark:from-blue-950/40 dark:via-blue-950/30 dark:to-indigo-950/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-indigo-400/10 rounded-full -ml-12 -mb-12" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                    <MessageSquare className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 font-medium">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">Chat Interface</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">Configure your AI assistant with advanced settings and personalization options</p>
              </CardContent>
            </Card>
          </div>

          <div className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 dark:from-purple-950/40 dark:via-purple-950/30 dark:to-pink-950/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full -ml-12 -mb-12" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow duration-300">
                    <Palette className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800 font-medium">
                    Customizable
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">Brand Design</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">Customize colors, logos, and messaging to perfectly match your brand identity</p>
              </CardContent>
            </Card>
          </div>

          <div className="group hover:scale-105 transition-all duration-300 cursor-pointer">
            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br from-teal-50 via-teal-50 to-green-100 dark:from-teal-950/40 dark:via-teal-950/30 dark:to-green-950/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/15 to-green-500/15 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/10 to-green-400/10 rounded-full -ml-12 -mb-12" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow duration-300">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800 font-medium">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">Live Preview</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">See your changes instantly with our real-time preview and testing system</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Configuration Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Configuration Forms */}
          <div className="xl:col-span-3 space-y-8">
            {/* API Configuration Section */}
            <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="border-b border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25 flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                      {t('api_section_title')}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {t('api_section_description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ChatConfigForm />
              </CardContent>
            </Card>

            {/* Branding Configuration Section */}
            <div className="transform hover:scale-[1.005] transition-transform duration-300">
              <BrandingConfigForm />
            </div>
          </div>

          {/* Right Column - Enhanced Preview */}
          <div className="xl:col-span-2">
            <div className="sticky top-6 space-y-6">
              <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md hover:shadow-2xl transition-all duration-300">
                <CardHeader className="border-b border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-teal-50/80 to-green-50/80 dark:from-teal-950/30 dark:to-green-950/30 p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/25 flex-shrink-0">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Live Preview
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Real-time chat interface preview
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-hidden">
                    <ChatPreview />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Status Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-green-800 dark:text-green-400 text-sm truncate">Configuration Active</p>
                      <p className="text-xs text-green-600 dark:text-green-500 truncate">All systems operational</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatConfigPage;
