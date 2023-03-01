CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    
    username varchar(255) UNIQUE NOT NULL, 
    hash varchar(255) NOT NULL
);

CREATE TABLE medication (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    user_id BIGINT NOT NULL,
    
    name varchar(255) UNIQUE NOT NULL, 
    description varchar(255) NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE medication_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    medication_id BIGINT NOT NULL,
    
    hour_of_day INT NOT NULL, 
    day_of_week INT,
    
    FOREIGN KEY (medication_id) REFERENCES medication (id)
);

CREATE TABLE medication_administrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medication_id BIGINT NOT NULL,
    
    timestamp BIGINT NOT NULL,
    
    -- Status Enumerations
    -- 0: On-Time
    -- 1: Early
    -- 2: Late
    status INT NOT NULL,

    FOREIGN KEY (medication_id) REFERENCES medication (id)
);

/*
Currently VERY up in the air:

CREATE TABLE medication_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    name varchar(255) UNIQUE NOT NULL
);

INSERT INTO medication_groups (
    name
) VALUES (
    "Default"
);
*/