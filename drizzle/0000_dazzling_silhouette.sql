CREATE TABLE `id_association` (
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` integer NOT NULL,
	PRIMARY KEY(`provider`, `provider_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`inserted_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`url` text NOT NULL,
	`already_read` integer,
	`rating` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_articles` ON `articles` (`user_id`,`title`,`content`,`url`);