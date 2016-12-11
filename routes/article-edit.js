
var router = require('express').Router(),
    db = require("../modules/db.js"),
    ObjectID = require("mongodb").ObjectID;


router.post(
    "/article-edit-section",
    function(req, res, next)
    {
        var updOper = {};
        updOper["content." + req.body['asid'] + ".sectContent"] = req.body['newcontent'];

        db.collection('articles').updateOne({_id: ObjectID(req.body['aid'])}, {$set: updOper})

            .then(function(){
                res.redirect('back');
            })

            .catch(function(error){
                respError(res, null, error);
            });

        // respError(res, null, new Error("Not implemented"));

        // console.log(req.body);
    }
);

router.post(
    "/article-rename-section",
    function(req, res, next)
    {
        var updOper = {};
        updOper["content." + req.body['asid'] + ".sectName"] = req.body['newname'];


        db.collection('articles').updateOne({_id: ObjectID(req.body['aid'])}, {$set: updOper})

            .then(function(){
                res.redirect('back');
            })

            .catch(function(error){
                respError(res, null, error);
            });

        // respError(res, null, new Error("Not implemented"));

        // console.log(req.body);
    }
);

router.post(
    "/article-delete-section",
    function(req, res, next)
    {
        db.collection('articles').findOne({_id: ObjectID(req.body['aid'])})

            .then(function(doc){
                doc.content.splice(req.body['asid'], 1);
                db.collection('articles').save(doc);
            })

            .then(function(){
                res.redirect('back');
            })

            .catch(function(error){
                respError(res, null, error);
            });

        // respError(res, null, new Error("Not implemented"));

        // console.log(req.body);
    }
);

router.post(
    "/article-insert-section",
    function(req, res, next)
    {
        db.collection('articles').findOne({_id: ObjectID(req.body['aid'])})

            .then(function(doc){
                doc.content.splice(
                    +req.body['asid'] + 1,
                    0,
                    {
                        "sectName": "SECTION " + (+req.body['asid'] + 1),
                        "sectContent": ""}
                );
                db.collection('articles').save(doc);
            })

            .then(function(){
                res.redirect('back');
            })

            .catch(function(error){
                respError(res, null, error);
            });

    }
);



module.exports = router;
