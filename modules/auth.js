
var db = require("../modules/db.js");

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


function validatePassword(actual, expected)
{
    return actual === expected;
}

passport.serializeUser(
    (user, done) => {
        done(null, user._id);
    }
);

passport.deserializeUser(
    (_id, done) => {
        db.collection('users').findOne({_id: db.ObjectID(_id)},
            (err, user) => { done(err, user); }
        );
    }
);

passport.use(
    new LocalStrategy(
        (username, password, done) =>
        {
            db.collection('users').findOne({ username: username })
                .then((user) => {
                        if (!user) {
                            return done(null, false, { message: 'Incorrect username' });
                        }

                        if (!validatePassword(password, user.password)) {
                            return done(null, false, { message: 'Incorrect password' });
                        }

                        return done(null, user);
                    }
                )
                .catch((err) => { return done(err); });
        }
    )
);


module.exports = passport;
