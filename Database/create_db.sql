CREATE DATABASE fibonacci;
CREATE DATABASE sessions;
USE	fibonacci;
CREATE TABLE Users (
	id	INT unsigned NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE calculations (
    id  INT unsigned NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,   
    input VARCHAR(500) NOT NULL,
    creation VARCHAR(20) NOT NULL,    
    verdict VARCHAR(60) NOT NULL,
    execution_time VARCHAR(60) NOT NULL,
    memory VARCHAR(60) NOT NULL,   
    output VARCHAR(500) NOT NULL,
    PRIMARY KEY (id)
);



