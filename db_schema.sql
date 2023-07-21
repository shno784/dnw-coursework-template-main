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
    like_number INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    article_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
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

-- Create a trigger to update like_number in the article table
-- Inspired from https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html
CREATE TRIGGER update_like_number AFTER INSERT ON likes
FOR EACH ROW
BEGIN
  -- Check if the like already exists (based on article_id and user_id)
  -- If it exists, delete it; otherwise, insert the new like
  DELETE FROM likes WHERE article_id = NEW.article_id AND user_id = NEW.user_id;
  INSERT INTO likes (article_id, user_id) VALUES (NEW.article_id, NEW.user_id);
  
  -- Update the like_number in the article table
  UPDATE article
  SET like_number = (SELECT COUNT(*) FROM likes WHERE article_id = NEW.article_id)
  WHERE id = NEW.article_id;
END;

CREATE TRIGGER update_like_number_after_delete AFTER DELETE ON likes
FOR EACH ROW
BEGIN
  -- Update the like_number in the article table after the delete
  UPDATE article
  SET like_number = (SELECT COUNT(*) FROM likes WHERE article_id = OLD.article_id)
  WHERE id = OLD.article_id;
END;

COMMIT;
