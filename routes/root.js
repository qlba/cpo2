
var router = require('express').Router();


router.get('/',
    function(req, res) {
        var sess = req.session;
        if (sess.views) {
            sess.views++;
            res.setHeader('Content-Type', 'text/html');
            res.write('<p>login: ' + JSON.stringify(req.user) + '</p>');
            res.write('<p>views: ' + sess.views + '</p>');
            res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
            res.end();
        } else {
            sess.views = 1;
            res.end('welcome to the session demo. refresh!');
        }
    }
);


module.exports = router;


// router.get('/', function(req, res){ res.redirect('/article?article=Meat%20Beat%20Manifest'); });

// Session manager
// function(req, res) {
//     var sess = req.session;
//     if (sess.views) {
//         sess.views++;
//         res.setHeader('Content-Type', 'text/html');
//         res.write('<p>login: ' + JSON.stringify(req.user) + '</p>');
//         res.write('<p>views: ' + sess.views + '</p>');
//         res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
//         res.end();
//     } else {
//         sess.views = 1;
//         res.end('welcome to the session demo. refresh!');
//     }
// }