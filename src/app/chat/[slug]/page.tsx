import { notFound } from 'next/navigation';
import { ChatInterface } from '@/features/chat/ChatInterface';
import { ChatConfigService } from '@/features/chat-config/ChatConfigService';

interface ChatPageProps {
  params: {
    slug: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { slug } = params;

  // Get chat configuration by public slug
  const config = await ChatConfigService.getByPublicSlug(slug);

  if (!config || !config.isEnabled) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ChatInterface config={config} />
    </div>
  );
}

// Generate metadata for the chat page
export async function generateMetadata({ params }: ChatPageProps) {
  const { slug } = params;
  const config = await ChatConfigService.getByPublicSlug(slug);

  if (!config) {
    return {
      title: 'Chat Not Found',
    };
  }

  return {
    title: `${config.chatTitle || 'Chat'} - ${config.companyName || 'Support'}`,
    description: config.welcomeMessage || 'Get help and support through our chat interface',
  };
}
