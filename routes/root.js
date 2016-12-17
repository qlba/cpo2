
var router = require('express').Router(),
    db = require("../modules/db.js"),
    responseWithError = require("./article").responseWithError;


router.get('/', (req, res) => {
    db.collection("article_versions").aggregate([
        { $sort: {
            updated: -1
        }},
        { $group: {
            _id: { articleId: "$articleid" },
            versionId: { $first: "$_id" },
            name: { $first: "$name" },
            lastUpdated: { $max: "$updated" }
        }},
        { $limit: 5 }
    ]).toArray()
        .then((recent) => {
            res.render('main/body', {recent: recent, login: req.user});
        })
        .catch((error) => {
            responseWithError(res, req.user, error);
        });
    

});


module.exports = router;
