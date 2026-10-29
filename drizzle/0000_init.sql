CREATE TABLE `account` (
	`access_token` text,
	`access_token_expires_at` integer,
	`account_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`id_token` text,
	`password` text,
	`provider_id` text NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`updated_at` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `api_key` (
	`created_at` integer NOT NULL,
	`key_hash` text NOT NULL,
	`prefix` text NOT NULL,
	`user_id` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_key_key_hash_unique` ON `api_key` (`key_hash`);--> statement-breakpoint
CREATE TABLE `billing_dispute` (
	`opened_at` integer NOT NULL,
	`payment_id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `billing_entitlement` (
	`customer_id` text NOT NULL,
	`email` text NOT NULL,
	`event_at` integer NOT NULL,
	`expires_at` integer,
	`kind` text NOT NULL,
	`product_id` text NOT NULL,
	`refunded_at` integer,
	`source_id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `billing_entitlement_email_idx` ON `billing_entitlement` (`email`);--> statement-breakpoint
CREATE TABLE `billing_payment` (
	`created_at` integer NOT NULL,
	`email` text NOT NULL,
	`payment_id` text PRIMARY KEY NOT NULL,
	`refunded` integer DEFAULT false NOT NULL,
	`subscription_id` text
);
--> statement-breakpoint
CREATE INDEX `billing_payment_subscription_idx` ON `billing_payment` (`subscription_id`);--> statement-breakpoint
CREATE TABLE `billing_webhook` (
	`event_type` text NOT NULL,
	`received_at` integer NOT NULL,
	`webhook_id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limit` (
	`count` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`last_request` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rate_limit_key_unique` ON `rate_limit` (`key`);--> statement-breakpoint
CREATE TABLE `session` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`ip_address` text,
	`token` text NOT NULL,
	`updated_at` integer NOT NULL,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`image` text,
	`name` text NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);