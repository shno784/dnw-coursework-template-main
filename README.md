##  Coursework Template ##
### CM2040 Database Networks and the Web ###

#### Installation requirements ####

* NodeJS 
    - follow the install instructions at https://nodejs.org/en/
    - we recommend using the latest LTS version
* Sqlite3 
    - Windows users: follow instructions here https://www.sqlitetutorial.net/download-install-sqlite/
    - Mac users: it comes preinstalled
    - Linux users: use a package manager eg. apt install

To install all the node packages run ```npm install``` from the project directory

#### Help with node SQLite3 ####

A few aspects SQLite3 work a little differently to mySql but all of the key concepts are the same

Find the API documentation at:
https://github.com/TryGhost/node-sqlite3/wiki/API

Find node SQLite tutorials at:
https://www.sqlitetutorial.net/sqlite-nodejs/
This also a good resource to find examples and tutorials around SQLite queries


#### Using this template ####

This template sets you off in the right direction for your coursework. To get started:

Run ```npm run build-db``` to create the database (database.db)
Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)

You can also run: 
```npm run clean-db``` to delete the database before rebuilding it for a fresh start

##### Next steps #####

* Explore the file structure and code
* Read all the comments
* Try accessing each of the routes via the browser - make sure you understand what they do
* Try creating ejs pages for each of the routes that retrieve and display the data
* Try enhancing the ```create-user-record``` page so that you can set the text in the record 
* Try adding new routes and pages to let the user create their own records

##### Creating database tables #####

* All database tables should created by modifying the db_schema.sql 
* This allows us to review and recreate your database simply by running ```npm run build-db```
* Do NOT create or alter database tables through other means


#### Preparing for submission ####

Make a copy of this folder
In your copy, delete the following files and folders:
    * node_modules
    * .git (the hidden folder with your git repository)
    * database.db (your database)

Make sure that your package.json file includes all of the dependencies for your project NB. you need to use the ```--save``` tag each time you use npm to install a dependency

#### Getting started with my project ####

The username and Password will be avaiable in the db_schema.sql file. 
To access author pages in URL- localhost:3000/author
To access reader pages in URL - localhost:3000/reader

Authors can also be readers and read other users' blogs and articles.

In the author page, PLEASE ENSURE TO CREATE A BLOG IN SETTINGS (If creating a new user) or the article will not update properly in the database.

If the marker is using a windows computer, ensure these changes in the package.json file:
    * "build-db": "type db_schema.sql |sqlite3 database.db ",
    * "clean-db": "del database.db #remove the old database",
    * "start": "nodemon index.js"
    * Since I am using windows I had to change the dummy data in the db_schema.sql file from ' quotation to ", this has been reverted to the original when downloaded including the
     package.json file.

Pre existing account usernames and passwords(Username is not case sensitive):
    * Username: admin    Password: Admin1
    * Username: administrator    Password: Admin1
    * Username: reader    Password: reader1


