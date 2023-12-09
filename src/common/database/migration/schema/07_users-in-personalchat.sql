CREATE TABLE USERS_IN_PERSONALCHAT (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user1_id INT,
    user2_id INT,
    room_id INT,
    FOREIGN KEY (room_id) REFERENCES ROOMS(id),
    FOREIGN KEY (user1_id) REFERENCES USER(id),
    FOREIGN KEY (user2_id) REFERENCES USER(id)
);