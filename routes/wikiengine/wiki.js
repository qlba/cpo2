/**
 * Created by qlba on 27.10.2016.
 */

var router = require('express').Router();

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





function respError(res, message)
{
    res.render('wikiengine/article/body', { error: message, login: 'qlba' });
}

function answerUsingDb(res, callback)
{
    require('mongodb').MongoClient.connect(
        'mongodb://127.0.0.1:27017/wikiengine',
        function (err, db)
        {
            if (err)
                respError(res, 'Server error');
            else
                answerer(null, res, db);
        }
    );
}



// async
// co
// 2do2go/

//  validator    jsonschema

router.get('/wiki/article', function(req, res, next) {
    db.connect()
        .then()
        .then()
        .catch()
        answerUsingDb(res,
            function (res, db) {
                if(req.query["article"] === undefined || req.query["article"] === '')
                    respError(res, 'Article not specified');
                else
                    db.collection('articles').find({name: req.query["article"]}).toArray(
                        function (err, article) {

                            if (err)
                                respError(res, 'Server error');
                            else if (article.length == 0)
                                respError(res, 'No such article');
                            else if (article.length > 1)
                                respError(res, 'Ambiguity');
                            else
                                res.render('wikiengine/article/body',
                                    {
                                        article: article[0],
                                        login: undefined,
                                        mkdn: require('markdown').markdown.toHTML
                                    }
                                );

                            db.close();
                        }
                    );
            }
        );
    }
);

router.get('/wiki/article-random', function(req, res, next) {

        answerUsingDb(res,
            function (res, db) {
                db.collection('articles').find().toArray(
                    function (err, article) {
                        if (err)
                            respError(res, 'Server error');
                        else if (article.length == 0)
                            respError(res, 'Nothing to choose from');
                        else {
                            var al = article.length;

                            res.render('wikiengine/article/body',
                                {
                                    article: article[Math.floor(Math.random() * al) % al],
                                    login: undefined,
                                    mkdn: require('markdown').markdown.toHTML
                                }
                            );
                        }

                        db.close();
                    }
                );
            }
        );
    }
);


router.get('/engine/stash/markdown', function(req, res, next)
    {
        res.render('engine/stash/markdown', {});
    }
);

router.post('/engine/stash/markdown-commit', function(req, res, next)
    {
        res.render('engine/stash/markdown-commit', {markdown: req.body['markdown'], mkdn: require('markdown').markdown.toHTML});
    }
);

module.exports = router;