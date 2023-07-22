-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
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
    blog_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blog_id) REFERENCES blog(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    article_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    date_created TEXT NOT NULL,
    username TEXT NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(id) ON DELETE CASCADE
);

-- User number 1
INSERT INTO users ("username", "user_password", "author") VALUES ("admin", "Admin1", 1);
INSERT INTO blog ("user_id", "blog_username", "title", "subtitle") VALUES ("1", "Admin", "Lovely Day", "Today");
INSERT INTO article ("title", "subtitle", "body", "date_created", "user_id", "blog_id", "published") VALUES ("Forsaken", "The realm of the wicked", "For once In my life I was a little boy who wanted to see the world.", "7/22/2023, 10:30:15 AM", 1, 1, 0);
INSERT INTO comments ("user_id", "article_id", "date_created", "username", "body") VALUES ("1", "1", "7/22/2023, 10:34:15 AM", "admin", "This was such a lovely Article!");

-- User number 2
INSERT INTO users ("username", "user_password", "author") VALUES ("administrator", "Admin1", 1);
INSERT INTO blog ("user_id", "blog_username", "title", "subtitle") VALUES ("2", "Administrator", "Cry me a river", "Dauntless");
INSERT INTO article ("user_id", "title", "subtitle", "body","date_created", "last_modified", "published", "publication_date", "like_number", "blog_id") VALUES 
(2, "Beauty", "The Holy land", "The land of the holy, We love to see the love", "7/22/2023, 10:30:15 AM", "7/22/2023, 10:30:15 AM", 1, "7/22/2023, 10:30:15 AM", 0, 2);
INSERT INTO article ("user_id", "title", "subtitle", "body","date_created", "last_modified", "published", "publication_date", "like_number", "blog_id") VALUES 
(2, "Angels", "The Light that shines bright", "Forever with me and loving soul!", "7/22/2023, 10:40:15 AM", "", 1, "7/22/2023, 10:45:15 AM", 0, 2);
INSERT INTO comments ("user_id", "article_id", "date_created", "username", "body") VALUES (2, 2, "7/22/2023, 10:34:15 AM", "Administrator", "This was such a lovely Article!");

-- User number 3
INSERT INTO users ("username", "user_password", "author") VALUES ("reader", "reader1", 0);






COMMIT;
