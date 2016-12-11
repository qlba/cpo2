
//  ObjectID = require("mongodb").ObjectID
//  var User = () => { return db.collection('users'); };

var router = require("express").Router(),
    db = require("../modules/db.js"),
    passport = require('../modules/auth.js');


router.get('/login', (req, res) => {
    res.render('login/body', {login: req.user});
});

router.get('/login/encrypt', (req, res) => {
    res.send('123');
});

router.post('/login', (req, res) => {
        passport.authenticate('local', (err, user, info) =>
            {
                if (err) {
                    res.status(500);
                    return res.send('Server error: ' + info.message);
                }

                if (!user) {
                    res.status(401);
                    return res.send(info.message);
                }

                req.login(user, (err) =>
                    {
                        if (err) {
                            res.status(500);
                            return res.send('Server error: ' + err);
                        }

                        return res.send('Login passed successfully');
                    }
                );
            }
        )(req, res);
    }
);

router.post('/logout', (req, res) => {
    req.logout();
    res.end();
});


module.exports = router;
