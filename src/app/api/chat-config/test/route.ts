import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ChatConfigService } from '@/features/chat-config/ChatConfigService';

// Validation schema for test connection
const testConnectionSchema = z.object({
  baseUrl: z.string().url('Please enter a valid URL').min(1, 'Base URL is required'),
  workflowId: z.string().min(1, 'Workflow ID is required'),
  apiKey: z.string().min(1, 'API Key is required'),
  testMessage: z.string().optional(),
});

// POST - Test API connection
export async function POST(request: NextRequest) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { baseUrl, workflowId, apiKey, testMessage } = testConnectionSchema.parse(body);

    const result = await ChatConfigService.testConnection(
      baseUrl,
      workflowId,
      apiKey,
      testMessage || 'Hello, this is a test message'
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error testing connection:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to test connection',
      },
      { status: 500 }
    );
  }
}
