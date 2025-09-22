import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';
import { chatConfigSchema } from '@/models/Schema';

export async function GET() {
  try {
    // Get all chat configurations to see what was created
    const configs = await db.select().from(chatConfigSchema);

    console.log('=== DEBUG: Chat Configurations ===');
    console.log('Total configs found:', configs.length);
    configs.forEach((config, index) => {
      console.log(`Config ${index + 1}:`, {
        id: config.id,
        organizationId: config.organizationId,
        publicSlug: config.publicSlug,
        companyName: config.companyName,
        isEnabled: config.isEnabled,
        baseUrl: config.baseUrl,
        workflowId: config.workflowId,
      });
    });

    return NextResponse.json({
      success: true,
      data: configs.map(config => ({
        id: config.id,
        organizationId: config.organizationId,
        publicSlug: config.publicSlug,
        companyName: config.companyName,
        isEnabled: config.isEnabled,
        baseUrl: config.baseUrl,
        workflowId: config.workflowId,
        // Don't expose API key in response
      })),
      message: 'All chat configurations',
    });
  } catch (error) {
    console.error('Debug error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
