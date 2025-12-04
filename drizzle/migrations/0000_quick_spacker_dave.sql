CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"deliveryTime" integer NOT NULL,
	"icon" text,
	"color" text DEFAULT '#0284c7',
	"imageUrl" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"status" text NOT NULL,
	"changedBy" text NOT NULL,
	"note" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderNumber" text NOT NULL,
	"buyerId" text NOT NULL,
	"sellerId" text,
	"serviceId" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"platformCommissionRate" numeric(5, 2) DEFAULT '20.00' NOT NULL,
	"platformCommission" numeric(10, 2),
	"agentEarnings" numeric(10, 2),
	"status" text DEFAULT 'pending' NOT NULL,
	"requirements" text,
	"deliveryMessage" text,
	"stripeSessionId" text,
	"stripePaymentIntentId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp,
	"deletedAt" timestamp,
	CONSTRAINT "orders_orderNumber_unique" UNIQUE("orderNumber"),
	CONSTRAINT "orders_stripeSessionId_unique" UNIQUE("stripeSessionId")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"orderId" uuid,
	"filename" text NOT NULL,
	"originalName" text NOT NULL,
	"mimeType" text NOT NULL,
	"size" integer NOT NULL,
	"path" text NOT NULL,
	"fileType" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updatedBy" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changedBy_user_id_fk" FOREIGN KEY ("changedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyerId_user_id_fk" FOREIGN KEY ("buyerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_sellerId_user_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_serviceId_services_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "services_slug_idx" ON "services" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "services_category_idx" ON "services" USING btree ("category");--> statement-breakpoint
CREATE INDEX "services_active_idx" ON "services" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "order_status_history_order_idx" ON "order_status_history" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "order_status_history_created_at_idx" ON "order_status_history" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "orders_buyer_idx" ON "orders" USING btree ("buyerId");--> statement-breakpoint
CREATE INDEX "orders_seller_idx" ON "orders" USING btree ("sellerId");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "orders_stripe_session_idx" ON "orders" USING btree ("stripeSessionId");--> statement-breakpoint
CREATE INDEX "files_user_idx" ON "files" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "files_order_idx" ON "files" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "files_type_idx" ON "files" USING btree ("fileType");--> statement-breakpoint
CREATE INDEX "files_created_at_idx" ON "files" USING btree ("createdAt");