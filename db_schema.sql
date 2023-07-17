
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_record_value TEXT NOT NULL,
    test_user_id  INT, --the user that the record belongs to
    FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
);


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
    likes TEXT UNIQUE,
    comments TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

--insert default data (if necessary here)

INSERT INTO testUsers ('test_name') VALUES ('Simon Star');
INSERT INTO testUserRecords ('test_record_value', 'test_user_id') VALUES( 'Lorem ipsum dolor sit amet', 1); --try changing the test_user_id to a different number and you will get an error

-- INSERT INTO testUsers ('test_name') VALUES ('Boob');
-- INSERT INTO testUserRecords ('test_record_value', 'test_user_id') VALUES( 'Lorem ipsum dolor sit amet', 1); --try changing the test_user_id to a different number and you will get an error

INSERT INTO users (id,username,password_hash,author) VALUES (1, 'admin','admin1', 0);
INSERT INTO blog(id, user_id, blog_username, title, subtitle) VALUES (1, 1, 'admin', 'love', 'live');
INSERT INTO article(id, title, subtitle, date_created, last_modified, published) VALUES (1, 'wijefkew', 'lkdw', 'dfkj', '23.43', 0);


COMMIT;