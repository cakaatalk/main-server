CREATE TABLE FRIENDS (
    user_id INT,
    friend_id INT,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES USER(id),
    FOREIGN KEY (friend_id) REFERENCES USER(id)
);