INSERT INTO commands (command, description)
VALUES (
        'psql -h <host> -p <port> -U <username> -d <database_name>',
        'Connect to a PostgreSQL database using psql client'
    ),
    (
        'pg_dump -h <host> -p <port> -U <username> -d <database_name> -f <output_file>',
        'Dump the contents of a PostgreSQL database to a file'
    ),
    (
        'pg_restore -h <host> -p <port> -U <username> -d <database_name> -f <input_file>',
        'Restore a PostgreSQL database from a dump file'
    ),
    (
        'create table <table_name> (column1 datatype, column2 datatype, ...);',
        'Create a new table in a PostgreSQL database'
    ),
    (
        'alter table <table_name> add column <column_name> datatype;',
        'Add a new column to an existing table in a PostgreSQL database'
    ),
    (
        'drop table <table_name>;',
        'Drop a table from a PostgreSQL database'
    ),
    (
        'create index <index_name> on <table_name> (column1, column2, ...);',
        'Create an index on one or more columns of a table in a PostgreSQL database'
    ),
    (
        'grant <privilege> on table <table_name> to <user_or_role>;',
        'Grant a privilege on a table to a user or role in a PostgreSQL database'
    ),
    (
        'revoke <privilege> on table <table_name> from <user_or_role>;',
        'Revoke a privilege on a table from a user or role in a PostgreSQL database'
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