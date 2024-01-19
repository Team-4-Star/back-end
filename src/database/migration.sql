DROP TABLE IF EXISTS commands;
DROP TABLE IF EXISTS users_flashcards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS flashcard_categories;
DROP TABLE IF EXISTS sessions;
CREATE TABLE commands (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    command TEXT NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE flashcard_categories (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    category TEXT NOT NULL
);
CREATE TABLE flashcards (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    category_id BIGSERIAL NOT NULL REFERENCES flashcard_categories(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition TEXT NOT NULL
);
CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULl
);
CREATE TABLE sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
) WITH (OIDS = FALSE);
CREATE TABLE users_flashcards (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGSERIAL NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flashcard_id BIGSERIAL NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    status TEXT NOT NULL
);