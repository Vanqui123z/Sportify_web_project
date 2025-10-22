-- Create notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL,
    `read` BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notifications_users 
    FOREIGN KEY (username) REFERENCES users(username)
);