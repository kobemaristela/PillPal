CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    
    username varchar(255) UNIQUE NOT NULL, 
    hash varchar(255) NOT NULL
);

CREATE TABLE medication_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    name varchar(255) UNIQUE NOT NULL
);

INSERT INTO medication_groups (
    name
) VALUES (
    "Default"
);

CREATE TABLE medication (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    
    name varchar(255) UNIQUE NOT NULL, 
    description varchar(255) NOT NULL,
    group_id BIGINT NOT NULL,

    FOREIGN KEY (group_id) REFERENCES medication_groups(id)
);

/*
Currently VERY up in the air:

CREATE TABLE medication_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, 
    time_of_day: INT, -- "0-24"
);
*/