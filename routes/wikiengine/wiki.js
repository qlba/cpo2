/**
 * Created by qlba on 27.10.2016.
 */

var router = require('express').Router();

/* GET home page. */
router.get(
    '/',
    function (req, res, next) {
    }
);



// var article = {
//     name: 'Meat Beat Manifest',
//     left: {
//         articleBrief: 'Meat beat manifest is a convention of efficient assassination technology. Meat beat manifest ' +
//         'was declared in 2005 at the conference "Thug Life 2005" in Brooklyn, New York.'
//     },
//     right: {
//         category: 'Thug Life 2015',
//         imageUrl: '/m60.bmp',
//         tableContent: [
//             {
//                 k: 'Year',
//                 v: '2015'
//             },
//             {
//                 k: 'Voices for',
//                 v: '352'
//             },
//             {
//                 k: 'Voices against',
//                 v: '0'
//             }
//         ]
//     },
//     content: [
//         {
//             sectId: 0,
//             sectName: 'Deadbeef Industries GmbH',
//             sectContent: 'Usual participant'
//         },
//         {
//             sectId: 1,
//             sectName: 'Forcemeat, Inc.',
//             sectContent: 'Hardcore meaters'
//         },
//         {
//             sectId: 2,
//             sectName: 'Deadmeat & co.',
//             sectContent: 'Just choppers'
//         }
//     ],
//     links: [
//         {
//             label: 'Main page',
//             url: '/wiki/article?article=mb'
//         }
//     ]
// };




var serror = {
    name: 'Server error',
    left: { articleBrief: '' },
    right: { category: '', imageUrl: '', tableContent: [ ] },
    content: [ ],
    links: [ ]
};

var noarticle = {
    name: 'No such article',
    left: { articleBrief: '' },
    right: { category: '', imageUrl: '', tableContent: [ ] },
    content: [ ],
    links: [ ]
};





router.get(
    '/wiki/article',
    function (req, res, next) {

        var MongoClient = require('mongodb').MongoClient;

        MongoClient.connect(
            'mongodb://127.0.0.1:27017/wikiengine',
            function (err, db) {

                if (err)
                {
                    res.render('wikiengine/article/body', { error: true, article: serror, login: 'qlba' });
                }
                else
                {
                    var articles = db.collection('articles');

// {name: req.query["article"]}
// {name: 'Meat Beat Manifest'}

                    articles.find({name: req.query["article"]}).toArray(
                        function(err, article)
                        {
                            console.log(article);

                            if(err)
                                res.render('wikiengine/article/body', { error: true, article: serror, login: 'qlba' });
                            else if(article.length != 1)
                                res.render('wikiengine/article/body', { error: true, article: noarticle, login: 'qlba'});
                            else
                                res.render('wikiengine/article/body', { error: false, article: article[0], login: undefined, mkdn: require('markdown').markdown.toHTML });

                            db.close();
                        }
                    );
                }
            }
        );



        // var MongoClient = require('mongodb').MongoClient;
        //
        // MongoClient.connect(
        //     'mongodb://127.0.0.1:27017/wikiengine',
        //     function(err, db) {
        //
        //         if(err)
        //             throw err;
        //
        //         var collection = db.collection('test_insert');
        //
        //         collection.
        //
        //         collection.insert({a:2}, function(err, docs) {
        //             collection.count(function(err, count) {
        //                 console.log(format("count = %s", count));
        //                 db.close();
        //             });
        //         });
        //
        //     }
        // );



    }
);

module.exports = router;


// BACKUP
/*
 title: req.query["article"] || 'Meat beat manifest (killers manifest)',
 articleSections:
 [
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
 },
 {
 sectId: 3,
 sectName: 'S3',
 sectContent: 'Just choppers'
 },
 {
 sectId: 4,
 sectName: 'S4',
 sectContent: 'Just choppers'
 },
 {
 sectId: 5,
 sectName: 'S5',
 sectContent: 'Just choppers'
 },
 {
 sectId: 6,
 sectName: 'S6',
 sectContent: 'Just choppers'
 },
 {
 sectId: 7,
 sectName: 'S7',
 sectContent: 'Just choppers'
 },
 {
 sectId: 8,
 sectName: 'S8',
 sectContent: 'Just choppers'
 },
 {
 sectId: 9,
 sectName: 'S9',
 sectContent: 'Just choppers'
 },
 {
 sectId: 10,
 sectName: 'S10',
 sectContent: 'Just choppers'
 },
 {
 sectId: 11,
 sectName: 'S11',
 sectContent: 'Just choppers'
 }
 ]
*/