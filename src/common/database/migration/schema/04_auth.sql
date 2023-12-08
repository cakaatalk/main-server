CREATE TABLE AUTH (
    auth_id INT PRIMARY KEY AUTO_INCREMENT,
    refresh_token TEXT,
    user_name VARCHAR(45) NOT NULL,
    user_id INT,
    email VARCHAR(45) NOT NULL
);