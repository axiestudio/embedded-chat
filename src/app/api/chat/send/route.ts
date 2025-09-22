import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { ChatConfigService } from '@/features/chat-config/ChatConfigService';

// Validation schema for chat message
const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  configId: z.number().int().positive('Config ID is required'),
});

// POST - Send message to chat API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, configId } = sendMessageSchema.parse(body);

    // Get chat configuration by ID
    // For now, we'll need to add a method to get by ID
    // Let's use a workaround by getting all configs and finding the one with matching ID
    const config = await ChatConfigService.getById(configId);

    if (!config || !config.isEnabled) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Chat configuration not found or disabled' 
        },
        { status: 404 }
      );
    }

    // Send message to the configured API
    const result = await ChatConfigService.sendMessage(
      config.baseUrl,
      config.workflowId,
      config.apiKey,
      message,
      sessionId
    );

    if (result.success) {
      // Extract the response from the API result
      let response = 'I apologize, but I encountered an error processing your request.';
      
      if (result.data) {
        // Try to extract the response from different possible formats
        if (typeof result.data === 'string') {
          response = result.data;
        } else if (result.data.response) {
          response = result.data.response;
        } else if (result.data.output) {
          response = result.data.output;
        } else if (result.data.message) {
          response = result.data.message;
        } else if (result.data.content) {
          response = result.data.content;
        } else {
          // If we can't find a specific field, try to stringify the result
          response = JSON.stringify(result.data);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          response,
          sessionId,
        },
      });
    } else {
      console.error('API Error:', result.error);
      return NextResponse.json({
        success: false,
        error: 'Failed to get response from AI service',
        details: result.error,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending message:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
