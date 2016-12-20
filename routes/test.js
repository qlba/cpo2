
var router = require("express").Router(),
    passport = require('../modules/auth.js');

router.get("/test", (req, res) =>
{
    res.render("test/main", {key: passport.publicKey});
});


module.exports = router;

