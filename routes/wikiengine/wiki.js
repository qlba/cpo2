/**
 * Created by qlba on 27.10.2016.
 */

var router = require('express').Router();

/* GET home page. */
router.get(
    '/',
    function (req, res, next) {
        res.render('index', {title: 'node + express + jade'});
    }
);

router.get(
    '/wiki/',
    function (req, res, next) {
        res.render('wikiengine/article/body', {title: '--dead-beef'});
    }
);

module.exports = router;
