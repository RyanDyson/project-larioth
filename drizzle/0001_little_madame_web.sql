CREATE TYPE "public"."role" AS ENUM('system', 'user', 'assistant');--> statement-breakpoint
CREATE TABLE "chats" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"model" text NOT NULL,
	"chat_uuid" uuid
);
--> statement-breakpoint
DROP TABLE "pg-drizzle_post" CASCADE;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_uuid_chats_uuid_fk" FOREIGN KEY ("chat_uuid") REFERENCES "public"."chats"("uuid") ON DELETE cascade ON UPDATE no action;