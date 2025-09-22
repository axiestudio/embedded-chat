-- SAFE MIGRATION: Only create chat_config table if it doesn't exist
-- This will NOT affect any existing tables in your production database
CREATE TABLE IF NOT EXISTS "chat_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"base_url" text NOT NULL,
	"workflow_id" text NOT NULL,
	"api_key" text NOT NULL,
	"company_name" text,
	"logo_url" text,
	"primary_color" text,
	"secondary_color" text,
	"welcome_message" text,
	"chat_title" text,
	"placeholder_text" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"public_slug" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- SAFE INDEX CREATION: Only create indexes if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS "chat_config_organization_id_idx" ON "chat_config" USING btree ("organization_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "chat_config_public_slug_idx" ON "chat_config" USING btree ("public_slug");