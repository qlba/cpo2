
var router = require('express').Router();


router.get('/', (req, res) => {
    res.redirect('/article-random');
});


module.exports = router;
