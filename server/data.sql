CREATE DATABASE biology;

CREATE TABLE major (
    id serial PRIMARY KEY,
    subject VARCHAR(10),
    title TEXT,
    credits INTEGER
);


CREATE TABLE user_major (
    id serial PRIMARY KEY,
    user_email VARCHAR(255),
    subject VARCHAR(10),
    title TEXT,
    credits INTEGER
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);