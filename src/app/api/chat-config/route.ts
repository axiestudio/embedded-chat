import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ChatConfigService } from '@/features/chat-config/ChatConfigService';

// Validation schema for chat configuration
const chatConfigSchema = z.object({
  baseUrl: z.string().url('Please enter a valid URL').min(1, 'Base URL is required'),
  workflowId: z.string().min(1, 'Workflow ID is required'),
  apiKey: z.string().min(1, 'API Key is required'),
  companyName: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  welcomeMessage: z.string().optional(),
  chatTitle: z.string().optional(),
  placeholderText: z.string().optional(),
  isEnabled: z.boolean().optional(),
  publicSlug: z.string().optional(),
});

// GET - Retrieve chat configuration for the current organization
export async function GET() {
  try {
    const authResult = await auth();
    console.log('Auth result:', authResult);

    if (!authResult.orgId) {
      return NextResponse.json(
        { error: 'Organization not found', debug: authResult },
        { status: 401 }
      );
    }

    const { orgId } = authResult;

    const config = await ChatConfigService.getByOrganizationId(orgId);

    if (!config) {
      return NextResponse.json(
        { error: 'Chat configuration not found' },
        { status: 404 }
      );
    }

    // Don't return the API key in the response for security
    const { apiKey, ...safeConfig } = config;

    return NextResponse.json({
      success: true,
      data: {
        ...safeConfig,
        hasApiKey: !!apiKey,
      },
    });
  } catch (error) {
    console.error('Error fetching chat configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update chat configuration
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
    const validatedData = chatConfigSchema.parse(body);

    const config = await ChatConfigService.upsert({
      organizationId: orgId,
      ...validatedData,
    });

    // Don't return the API key in the response for security
    if (!config) {
      return NextResponse.json(
        { error: 'Failed to save configuration' },
        { status: 500 }
      );
    }

    const { apiKey, ...safeConfig } = config;

    return NextResponse.json({
      success: true,
      data: {
        ...safeConfig,
        hasApiKey: !!apiKey,
      },
      message: 'Chat configuration saved successfully',
    });
  } catch (error) {
    console.error('Error saving chat configuration:', error);

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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing chat configuration
export async function PUT(request: NextRequest) {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = chatConfigSchema.partial().parse(body);

    const config = await ChatConfigService.update(orgId, validatedData);

    if (!config) {
      return NextResponse.json(
        { error: 'Chat configuration not found' },
        { status: 404 }
      );
    }

    // Don't return the API key in the response for security
    const { apiKey, ...safeConfig } = config;

    return NextResponse.json({
      success: true,
      data: {
        ...safeConfig,
        hasApiKey: !!apiKey,
      },
      message: 'Chat configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating chat configuration:', error);

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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete chat configuration
export async function DELETE() {
  try {
    const { orgId } = await auth();

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 401 }
      );
    }

    const config = await ChatConfigService.delete(orgId);

    if (!config) {
      return NextResponse.json(
        { error: 'Chat configuration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chat configuration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chat configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
