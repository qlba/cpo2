
var router = require("express").Router(),
    passport = require('../modules/auth.js');



router.get('/login', (req, res) => {
    res.render('login/body', {key: passport.publicKey, login: req.user});
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

                    return res.send('Logged in');
                }
            );
        }
    )(req, res);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.end();
});

router.post('/signup', (req, res) => {

    passport.signup(req.body['username'], req.body['password'])
        .then(() => 
        {
            res.send('Signed up');
        })
        .catch((err) => 
        {
            res.status(500);
            res.send(err.message);
        });
});


module.exports = router;
