
var rsa = new require('node-rsa')(),
    sha = require('../modules/hash'),
    db = require("../modules/db.js"),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

console.log("Generating RSA key pair...");
var rsaKeyPair = rsa.generateKeyPair(2048, 65537);
console.log("Finished generating RSA key pair");


function validatePassword(actual, expected)
{
    actual = new Buffer(actual, 'base64');

    console.log(actual);

    console.log('Before fail');
    console.log(rsaKeyPair.decrypt(actual));
    console.log(rsaKeyPair.decrypt(actual).toString());
    console.log(sha.SHA256(rsaKeyPair.decrypt(actual)).toString());
    console.log('After fail');


    return sha.SHA256(rsaKeyPair.decrypt(actual)).toString() === expected;

    // return sha.SHA256(rsaKeyPair.decrypt(actual)) === expected;
}

function signUp(username, password)
{
    return db.collection('users').findOne({ username: username })
        .then((user) =>
        {
            if (user) {
                throw new Error('Username already taken');
            }

            return db.collection('users').insertOne({
                username: username,
                password: sha.SHA256(rsaKeyPair.decrypt(password)).toString(),
                status: 0,
                permissions: [],
                quota_left: [],
                bans: []
            });
        });
}


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    db.collection('users').findOne({_id: db.ObjectID(_id)},
        (err, user) => { done(err, user); }
    );
});

passport.use(
    new LocalStrategy(
        (username, password, done) =>
        {
            db.collection('users').findOne({ username: username })
                .then((user) => {
                        if (!user) {
                            return done(null, false, { message: 'Incorrect username' });
                        }

                        try {
                            if (!validatePassword(password, user.password)) {
                                return done(null, false, {message: 'Incorrect password'});
                            }
                        } catch (err) {
                            console.log(err);
                            return done(null, false, {message: 'Error occurred while checking password'});
                        }

                        return done(null, user);
                    }
                )
                .catch((err) => { return done(err); });
        }
    )
);


module.exports = passport;
module.exports.publicKey = rsaKeyPair.exportKey('public');
module.exports.signup = signUp;
