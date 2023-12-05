CREATE TABLE MESSAGES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    sender INT NOT NULL,
    room_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES USER(id),
    FOREIGN KEY (room_id) REFERENCES ROOMS(id)
);
