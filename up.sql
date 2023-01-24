CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    
    username varchar(255) UNIQUE NOT NULL, 
    hash varchar(255) NOT NULL
);