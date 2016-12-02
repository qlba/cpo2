/**
 * Created by qlba on 27.10.2016.
 */


var router = require("express").Router(),
    db = require("../modules/db.js"),
    ObjectID = require("mongodb").ObjectID;


function respArticle(res, login, art_arr)
{
    if (art_arr.length < 1)
        throw new Error("No such article");
    else if (art_arr.length > 1)
        res.render("article/body",
            {
                error: "Search results:",
                login: login,
                addInfo: art_arr
                    .map(function(a){return "<a href=\'article?article=" + a.name + "\'>" + a.name + "</a>"})
                    .join("\<br\>")
            }
        );
    else
        res.render("article/body",
            {
                article: art_arr[0],
                isEditing: true,
                login: login,
                mkdn: require("markdown").markdown.toHTML
            }
        );
}

function respError(res, login, error)
{
    res.render("article/body",
        {
            error: error.message,
            login: login
        }
    );
}


router.get(
    "/article",
    function(req, res, next)
    {
        var aq = req.query["article"];

        new Promise(function(rsl, rej) {
            aq ?
                rsl({name: aq[0] == '#' ? {$regex: aq.substr(1)} : aq}) :
                rej(new Error('Article not specified'));
        })
        .then(function(query){
            return db.collection('articles').find(query).toArray();
        })
        .then(function(articles){
            respArticle(res, null, articles);
        })
        .catch(function(error){
            respError(res, null, error);
        });
    }
);

router.get(
    "/article-random",
    function(req, res, next)
    {
        db.collection('articles').aggregate([{$sample: {size: 1}}]).toArray()

        .then(function(articles){
            res.redirect("/article?article=" + articles[0].name);
        })

        .catch(function(error){
            respError(res, null, error);
        });
    }
);


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


module.exports = router;



// Article content to Jade
/*
 var article = {
 name: 'Meat Beat Manifest',
 left: {
 articleBrief: 'Meat beat manifest is a convention of efficient assassination technology. Meat beat manifest ' +
 'was declared in 2005 at the conference "Thug Life 2005" in Brooklyn, New York.'
 },
 right: {
 category: 'Thug Life 2015',
 imageUrl: '/m60.bmp',
 tableContent: [
 {
 k: 'Year',
 v: '2015'
 },
 {
 k: 'Voices for',
 v: '352'
 },
 {
 k: 'Voices against',
 v: '0'
 }
 ]
 },
 content: [
 {
 sectId: 0,
 sectName: 'Deadbeef Industries GmbH',
 sectContent: 'Usual participant'
 },
 {
 sectId: 1,
 sectName: 'Forcemeat, Inc.',
 sectContent: 'Hardcore meaters'
 },
 {
 sectId: 2,
 sectName: 'Deadmeat & co.',
 sectContent: 'Just choppers'
 }
 ],
 links: [
 {
 label: 'Main page',
 url: '/wiki/article?article=mb'
 }
 ]
 };
 */

// require('../../logic/wiki/article');

// return new Promise(
//     function (rsl, rej)
//     {
//
//     }
// );
