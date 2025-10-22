-- Create notifications table
CREATE TABLE `notifications` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(10) NOT NULL CHECK (type IN ('success', 'error', 'info', 'warning')),
    `timestamp` DATETIME NOT NULL,
    `read` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_notifications_users` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);