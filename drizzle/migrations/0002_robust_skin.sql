CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"token" text NOT NULL,
	"invitedBy" text NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"acceptedAt" timestamp,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedBy_user_id_fk" FOREIGN KEY ("invitedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;