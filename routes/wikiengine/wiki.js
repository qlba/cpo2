/**
 * Created by qlba on 27.10.2016.
 */

var router = require('express').Router();


function respSingleArticle(res, login, art_arr)
{
    return new Promise(function(rsl, rej){
        if (art_arr.length == 0)
            rej(new Error('No such article'));
        else if (art_arr.length > 1)
            rej(new Error('Ambiguity'));
        else
            res.render('wikiengine/article/body',
                {
                    article: art_arr[0],
                    login: login,
                    mkdn: require('markdown').markdown.toHTML
                }
            );
    });
}

function respRandomArticle(res, login, art_arr)
{
    return new Promise(function (rsl, rej){
        if (art_arr.length == 0)
            rej(new Error('Nothing to choose from'));
        else {
            var al = art_arr.length;

            res.render('wikiengine/article/body',
                {
                    article: art_arr[Math.floor(Math.random() * al) % al],
                    login: login,
                    mkdn: require('markdown').markdown.toHTML
                }
            );
        }
    });
}

function respError(res, login, error)
{
    return new Promise(function(rsl, rej){
        res.render(
            'wikiengine/article/body',
            {
                error: error.message,
                login: login
            }
        );
    });
}


router.get(
    '/wiki/article',
    function(req, res, next)
    {
        db.collection('articles').find({name: req.query["article"]}).toArray()
        .then(function(articles){
            return respSingleArticle(res, null, articles);
        })
        .catch(function(error){
            return respError(res, null, error);
        });
    }
);

router.get(
    '/wiki/article-random',
    function(req, res, next)
    {
        db.collection('articles').find().toArray()
        .then(function(articles){
            return respRandomArticle(res, null, articles);
        })
        .catch(function(error){
            return respError(res, null, error);
        });
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

// require('../../logic/wikiengine/article');

// return new Promise(
//     function (rsl, rej)
//     {
//
//     }
// );
