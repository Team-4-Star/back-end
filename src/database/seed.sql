INSERT INTO commands (command, description)
VALUES (
        'createdb <database_name>',
        'Create a PostgreSQL database'
    ),
    (
        'dropdb <database_name>',
        'Drop a PostgreSQL database'
    );
INSERT INTO flashcard_categories (category)
VALUES ('React'),
    ('Node');
INSERT INTO flashcards (category_id, word, definition)
VALUES (
        1,
        'What is a component?',
        'A component in React is a reusable and self-contained piece of code that defines a part of a user interface.'
    ),
    (
        1,
        'What is a prop?',
        'A prop in React is a special keyword that stands for properties and is used to pass data from a parent component to a child component.'
    ),
    (
        2,
        'What is Node?',
        'Node.js is a server-side JavaScript runtime that allows developers to execute JavaScript code on the server, or back-end.'
    ),
    (
        2,
        'What is NPM?',
        'NPM (Node Package Manager) is a package manager for JavaScript that facilitates the discovery, installation, and management of third-party packages and dependencies used in Node.js projects.'
    );