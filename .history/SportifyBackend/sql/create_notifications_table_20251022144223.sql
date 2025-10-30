-- Create notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT,
    message TEXT NOT NULL,
    type VARCHAR(10) NOT NULL,
    timestamp DATETIME NOT NULL,
    `read` BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);