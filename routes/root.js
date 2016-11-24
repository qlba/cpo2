/**
 * Created by qlba on 24.11.2016.
 */

var router = require('express').Router();

router.get('/', function(req, res, next){res.redirect('/article')});


module.exports = router;
