USE mysql_project_db;

DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sessions;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ol_key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author_names VARCHAR(500), 
    first_publish_year INT,
    cover_id VARCHAR(50) 
);

CREATE TABLE user_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status ENUM('want_to_read', 'have_read') NOT NULL,
    date_added DATE DEFAULT (CURRENT_DATE()),
    date_completed DATE NULL, 
    
    UNIQUE KEY unique_user_book (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin,
    PRIMARY KEY (session_id)
);


INSERT INTO users (username, password_hash) VALUES
('testuser', '$2b$10$5vz8qw7HlQHJ5rJ5qJ5qJOQJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5q'), 
('janedoe', '$2b$10$5vz8qw7HlQHJ5rJ5qJ5qJOQJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5q');

INSERT INTO books (ol_key, title, author_names, first_publish_year, cover_id) VALUES
('/works/OL471379W', 'The Hobbit', 'J. R. R. Tolkien', 1937, '6783960'),
('/works/OL2280629W', '1984', 'George Orwell', 1949, '8264516'),
('/works/OL2171181W', 'To Kill a Mockingbird', 'Harper Lee', 1960, '1432244');

INSERT INTO user_books (user_id, book_id, status, date_completed) VALUES
(1, 1, 'have_read', '2025-10-15'), 
(1, 2, 'want_to_read', NULL), 
(2, 3, 'have_read', '2025-09-01');