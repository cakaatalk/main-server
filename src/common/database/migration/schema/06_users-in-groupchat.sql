CREATE TABLE USERS_IN_GROUPCHAT (
    room_id INT,
    user_id INT,
    PRIMARY KEY (room_id, user_id),
    FOREIGN KEY (room_id) REFERENCES ROOMS(id),
    FOREIGN KEY (user_id) REFERENCES USER(id)
);
