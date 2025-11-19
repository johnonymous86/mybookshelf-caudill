const db = require('../config/connection');

class Book {
    static async fetchUserBookshelf(userId) {
        try {
            const [readBooks] = await db.query(`
                SELECT 
                    b.id,
                    b.ol_key,
                    b.title,
                    b.author_names,
                    b.first_publish_year,
                    b.cover_id,
                    ub.date_completed
                FROM user_books ub
                JOIN books b ON ub.book_id = b.id
                WHERE ub.user_id = ? AND ub.status = 'have_read'
                ORDER BY ub.date_completed DESC
            `, [userId]);
            const [wantToReadBooks] = await db.query(`
                SELECT 
                    b.id,
                    b.ol_key,
                    b.title,
                    b.author_names,
                    b.first_publish_year,
                    b.cover_id,
                    ub.date_added
                FROM user_books ub
                JOIN books b ON ub.book_id = b.id
                WHERE ub.user_id = ? AND ub.status = 'want_to_read'
                ORDER BY ub.date_added DESC
            `, [userId]);

            return {
                read: readBooks,
                wantToRead: wantToReadBooks
            };
        } catch (error) {
            console.error('[MODEL] Error fetching user bookshelf:', error);
            throw error;
        }
    }

    static async findOrCreate(bookData) {
        try {
            const { ol_key, title, author_names, first_publish_year, cover_id } = bookData;
            
            // Check if book exists
            const [existing] = await db.query(
                'SELECT * FROM books WHERE ol_key = ?',
                [ol_key]
            );

            if (existing.length > 0) {
                return existing[0];
            }

            // Insert new title
            const [result] = await db.query(
                'INSERT INTO books (ol_key, title, author_names, first_publish_year, cover_id) VALUES (?, ?, ?, ?, ?)',
                [ol_key, title, author_names, first_publish_year, cover_id]
            );

            return { id: result.insertId, ...bookData };
        } catch (error) {
            console.error('[MODEL] Error finding/creating book:', error);
            throw error;
        }
    }

    // Add to bookshelf
    static async addToUserBookshelf(userId, bookId, status) {
        try {
            await db.query(
                'INSERT INTO user_books (user_id, book_id, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
                [userId, bookId, status, status]
            );
            return true;
        } catch (error) {
            console.error('[MODEL] Error adding book to bookshelf:', error);
            throw error;
        }
    }

    // Remove from bookshelf
    static async removeFromUserBookshelf(userId, bookId) {
        try {
            await db.query(
                'DELETE FROM user_books WHERE user_id = ? AND book_id = ?',
                [userId, bookId]
            );
            return true;
        } catch (error) {
            console.error('[MODEL] Error removing book from bookshelf:', error);
            throw error;
        }
    }
}

module.exports = { Book };