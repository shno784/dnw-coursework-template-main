const argon2 = require('argon2');

//Hash the password
async function hashPassword(password) {
    try {
        return argon2.hash(password);
    } catch (error) {
        console.log("Error hashing password", error);
    }
}

async function checkPassword(hashedPassword, password) {

    try {
        const correct = await argon2.verify(hashedPassword, password);
        if (correct) {
            return true;
        } 
        return false;
    } catch (error) {
        console.log("Error argon2 verification", error);
    }
}

async function checkAuthor(isAuthor) {
    if(isAuthor == 1) {
        res.redirect("/author");
        }else {
            res.redirect("/reader")
        }
}

module.exports = {hashPassword, checkPassword, checkAuthor};