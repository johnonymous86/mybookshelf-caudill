USE mysql_project_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL
);

DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;



-- Drop tables if they exist to allow for clean setup/reset
DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- 1. USERS Table: For authentication and user accounts
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    -- In a real application, this should store a secure hash, not the plaintext password
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BOOKS Table: To cache essential book details retrieved from Open Library
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- Unique identifier for the Work from Open Library (e.g., /works/OL15549026W)
    ol_key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    author_names VARCHAR(500), -- Store authors as a comma-separated string or JSON string
    first_publish_year INT,
    cover_id VARCHAR(50) -- Used to construct the Open Library cover image URL
);

-- 3. USER_BOOKS Table: The core 'Bookshelf' tracking table
CREATE TABLE user_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    -- Status of the book: 'want_to_read' or 'have_read'
    status ENUM('want_to_read', 'have_read') NOT NULL,
    date_added DATE DEFAULT (CURRENT_DATE()),
    date_completed DATE NULL, -- Only set if status is 'have_read'
    
    -- Ensure a user can only have one status entry for a single book
    UNIQUE KEY unique_user_book (user_id, book_id),

    -- Foreign Key constraints to maintain data integrity
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Example Data for Testing
INSERT INTO users (username, password_hash) VALUES
('testuser', '$2a$10$HASHED_PASSWORD_PLACEHOLDER'), -- Replace with a real bcrypt hash in production
('janedoe', '$2a$10$ANOTHER_HASHED_PASSWORD');

INSERT INTO books (ol_key, title, author_names, first_publish_year, cover_id) VALUES
('/works/OL471379W', 'The Hobbit', 'J. R. R. Tolkien', 1937, '6783960'),
('/works/OL2280629W', '1984', 'George Orwell', 1949, '8264516'),
('/works/OL2171181W', 'To Kill a Mockingbird', 'Harper Lee', 1960, '1432244');

INSERT INTO user_books (user_id, book_id, status, date_completed) VALUES
(1, 1, 'have_read', '2025-10-15'), -- testuser read The Hobbit
(1, 2, 'want_to_read', NULL), -- testuser wants to read 1984
(2, 3, 'have_read', '2025-09-01'); -- janedoe read To Kill a Mockingbird