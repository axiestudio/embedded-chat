import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { db } from '@/libs/DB';
import { chatConfigSchema } from '@/models/Schema';

export interface ChatConfigData {
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
  isEnabled?: boolean;
  publicSlug?: string;
}

export interface ChatConfigUpdate {
  baseUrl?: string;
  workflowId?: string;
  apiKey?: string;
  companyName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  welcomeMessage?: string;
  chatTitle?: string;
  placeholderText?: string;
  isEnabled?: boolean;
}

export class ChatConfigService {
  /**
   * Get chat configuration for an organization
   */
  static async getByOrganizationId(organizationId: string) {
    const result = await db
      .select()
      .from(chatConfigSchema)
      .where(eq(chatConfigSchema.organizationId, organizationId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get chat configuration by public slug
   */
  static async getByPublicSlug(publicSlug: string) {
    const result = await db
      .select()
      .from(chatConfigSchema)
      .where(eq(chatConfigSchema.publicSlug, publicSlug))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get chat configuration by ID
   */
  static async getById(id: number) {
    const result = await db
      .select()
      .from(chatConfigSchema)
      .where(eq(chatConfigSchema.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create or update chat configuration for an organization
   */
  static async upsert(data: ChatConfigData) {
    const existingConfig = await this.getByOrganizationId(data.organizationId);

    if (existingConfig) {
      // Update existing configuration
      const updateData: ChatConfigUpdate = {
        baseUrl: data.baseUrl,
        workflowId: data.workflowId,
        apiKey: data.apiKey,
        companyName: data.companyName,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        welcomeMessage: data.welcomeMessage,
        chatTitle: data.chatTitle,
        placeholderText: data.placeholderText,
        isEnabled: data.isEnabled,
      };

      const result = await db
        .update(chatConfigSchema)
        .set(updateData)
        .where(eq(chatConfigSchema.organizationId, data.organizationId))
        .returning();

      return result[0];
    } else {
      // Create new configuration
      let publicSlug = data.publicSlug || this.generateSlug();

      // Ensure the slug is unique
      while (!(await this.isSlugAvailable(publicSlug))) {
        publicSlug = this.generateSlug();
      }
      
      const result = await db
        .insert(chatConfigSchema)
        .values({
          organizationId: data.organizationId,
          baseUrl: data.baseUrl,
          workflowId: data.workflowId,
          apiKey: data.apiKey,
          companyName: data.companyName,
          logoUrl: data.logoUrl,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          welcomeMessage: data.welcomeMessage,
          chatTitle: data.chatTitle,
          placeholderText: data.placeholderText,
          isEnabled: data.isEnabled ?? true,
          publicSlug,
        })
        .returning();

      return result[0];
    }
  }

  /**
   * Update chat configuration
   */
  static async update(organizationId: string, data: ChatConfigUpdate) {
    const result = await db
      .update(chatConfigSchema)
      .set(data)
      .where(eq(chatConfigSchema.organizationId, organizationId))
      .returning();

    return result[0] || null;
  }

  /**
   * Delete chat configuration
   */
  static async delete(organizationId: string) {
    const result = await db
      .delete(chatConfigSchema)
      .where(eq(chatConfigSchema.organizationId, organizationId))
      .returning();

    return result[0] || null;
  }

  /**
   * Generate a unique public slug
   */
  static generateSlug(): string {
    return nanoid(10).toLowerCase();
  }

  /**
   * Check if a public slug is available
   */
  static async isSlugAvailable(slug: string): Promise<boolean> {
    const existing = await this.getByPublicSlug(slug);
    return !existing;
  }

  /**
   * Send message to API
   */
  static async sendMessage(baseUrl: string, workflowId: string, apiKey: string, message: string, sessionId: string) {
    try {
      const fullEndpoint = `${baseUrl.replace(/\/$/, '')}/${workflowId}`;

      const payload = {
        output_type: "chat",
        input_type: "chat",
        input_value: message,
        session_id: sessionId,
      };

      const response = await fetch(fullEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          data: result,
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test API connection
   */
  static async testConnection(baseUrl: string, workflowId: string, apiKey: string, testMessage = 'Hello, this is a test message') {
    try {
      const fullEndpoint = `${baseUrl.replace(/\/$/, '')}/${workflowId}`;
      
      const payload = {
        output_type: "chat",
        input_type: "chat",
        input_value: testMessage,
        session_id: `test-${Date.now()}`,
      };

      const response = await fetch(fullEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          data: result,
          message: 'Connection successful',
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          message: 'Connection failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Connection error',
      };
    }
  }
}
