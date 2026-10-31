CREATE TABLE `billing_email_delivery` (
	`delivered_at` integer,
	`email` text NOT NULL,
	`html` text NOT NULL,
	`source_id` text PRIMARY KEY NOT NULL,
	`subject` text NOT NULL,
	`text` text NOT NULL
);
