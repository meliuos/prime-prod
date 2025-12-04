CREATE TABLE "showcases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"imageUrl" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE INDEX "showcases_order_idx" ON "showcases" USING btree ("order");--> statement-breakpoint
CREATE INDEX "showcases_active_idx" ON "showcases" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "showcases_category_idx" ON "showcases" USING btree ("category");