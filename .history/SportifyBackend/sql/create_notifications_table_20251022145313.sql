-- Drop table if exists
DROP TABLE IF EXISTS notifications;

-- Create notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(16) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    FOREIGN KEY (username) REFERENCES users(username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;