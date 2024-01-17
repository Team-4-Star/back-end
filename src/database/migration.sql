DROP TABLE IF EXISTS commands;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS flashcard_categories;
CREATE TABLE commands (
    id BIGSERIAL PRIMARY KEY,
    command TEXT NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE flashcard_categories (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL
);
CREATE TABLE flashcards (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGSERIAL REFERENCES flashcard_categories(id) NOT NULL,
    word TEXT NOT NULL,
    definition TEXT NOT NULL
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);
CREATE TABLE sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
) WITH (OIDS = FALSE);