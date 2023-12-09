CREATE TABLE PROFILE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    image_url VARCHAR(255),
    comment VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES USER(id)
);