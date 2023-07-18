
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    author INTEGER
);

CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    blog_username TEXT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS article (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    body TEXT,
    date_created TEXT NOT NULL,
    last_modified TEXT,
    published INTEGER,
    publication_date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    article_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES article(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    date_created TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    body TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES article(id)
);

--insert default data (if necessary here)

INSERT INTO users (id,username,password_hash,author) VALUES (1, 'admin','admin1', 0);
INSERT INTO blog(id, user_id, blog_username, title, subtitle) VALUES (1, 1, 'admin', 'love', 'live');
INSERT INTO article(id, title, subtitle, date_created, last_modified, published) VALUES (1, 'wijefkew', 'lkdw', 'dfkj', '23.43', 0);


COMMIT;