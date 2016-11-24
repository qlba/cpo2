// /**
//  * Created by qlba on 17.11.2016.
//  */
//
// // return new Promise(function(resolve, reject) {
// //
// // });
//
// var wikidb = require('./db/wiki');
//
//
// function responseWithArticle(res, articleData, loginData)
// {
//     res.render('wiki/article/body',
//         {
//             article: articleData,
//             mkdn: require('markdown').markdown.toHTML,
//             login: loginData
//         }
//     );
// }
//
// function responseWithError(res, error, loginData)
// {
//     res.render('wiki/article/body',
//         {
//             error: message,
//             login: loginData
//         }
//     );
// }
//
//
// function findRecords(collection, selector) {
//     return new Promise(function(resolve, reject) {
//         collection.find(selector).toArray(
//             function(err, arr) {
//                 err ? reject(err) : resolve(arr);
//             }
//         );
//     });
// }
//
//
//
//
//
//
//
//
//
// function processArticleRequest(res, title, loginData)
// {
//     wikidb('articles')
//         .then(function(articles){findRecords(articles, title)}, null)
//         .then(responseWithArticle())
//         .catch();
// }
//
//
//
//
//
//
//
//
//
//
// function getArticlesCollectionPromise()
// {
//     return new Promise(
//         function(resolve, reject)
//         {
//             wikidb('articles', resolve);
//         }
//     );
// }
//
//
// function findArticlesPromise(selector)
// {
//     return new Promise(
//         function(resolve, reject)
//         {
//             wikidb('articles',
//         }
//     );
// }
//
//
//
// function getArticle(artTitle)
// {
//     return new Promise(
//         function (resolve, reject) {
//             wikidb('articles',
//                 function(err, collection)
//                 {
//                     if(err) {
//                         reject(err);
//                         return;
//                     }
//
//                     collection.find({title: artTitle}).toArray(
//                         resolve()
//                     );
//                 }
//             );
//         }
//     );
// }
//
//
// function getArticle(artTitle, callback)
// {
//
// }
//
//
// wikidb('articles', kalbak);
//
//
//
//
//
// module.exports = null;
//
//
//
//
//
//
//
//
//
//
//
// router.get('/wiki/article', function(req, res, next) {
//
//         answerUsingDb(res,
//             function (res, db) {
//                 if(req.query["article"] === undefined || req.query["article"] === '')
//                     respError(res, 'Article not specified');
//                 else
//                     db.collection('articles').find({name: req.query["article"]}).toArray(
//                         function (err, article) {
//
//                             if (err)
//                                 respError(res, 'Server error');
//                             else if (article.length == 0)
//                                 respError(res, 'No such article');
//                             else if (article.length > 1)
//                                 respError(res, 'Ambiguity');
//                             else
//                                 res.render('wiki/article/body',
//                                     {
//                                         article: article[0],
//                                         login: undefined,
//                                         mkdn: require('markdown').markdown.toHTML
//                                     }
//                                 );
//
//                             db.close();
//                         }
//                     );
//             }
//         );
//     }
// );