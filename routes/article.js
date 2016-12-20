
var router = require("express").Router(),
    db = require("../modules/db.js"),
    ObjectID = db.ObjectID;


function StatusedError(message, status)
{
    var err = new Error(message);
    err.status = status;

    return err;
}


function processArticleRequest(res, login, req_article, req_version)
{
    if(req_version) {
        responseWithArticleVersion(res, login, req_version);
    } else if(req_article) {
        responseWithArticle(res, login, req_article);
    } else {
        responseWithError(res, login, new Error("Bad request"), 400);
    }
}

function responseWithArticle(res, login, req_article)
{
    var query = {name: req_article[0] === '#' ? {$regex: req_article.substr(1)} : req_article};

    db.collection('articles').find(query).toArray((err, articles) => {
        switch (articles.length) {
            case 0:
                var message =
                    (req_article[0] === '#') ?
                        "No match" :
                        "No such article, follow <a href=\"/article-create?article=" +
                        req_article + "\">this link</a> to try to create it.";

                responseWithError(res, login, new Error(message), 404);
                break;
            case 1:
                responseWithArticleVersion(res, login, articles[0].main_version);
                break;
            default:
                res.render("article/ambiguity", {
                        articles: articles.map((article) => {
                            return {name: article.name, link: '/article?article=' + article.name};
                        }),
                        login: login
                    }
                );
                break;
        }
    });
}

function responseWithArticleVersion(res, login, req_version)
{
    db.collection("article_versions").findOne({_id: ObjectID(req_version)}, (err, version) =>
    {
        if(err) {
            return responseWithError(res, login, err, 500);
        }

        if(!version) {
            return responseWithError(res, login, new Error("Article version not found"), 404);
        }

        res.render('article/body', {
            title: version.name,
            article: version.content,
            metaInfo: version,
            isEditing: !!res.forEdit,
            login: login,
            markdown: require("markdown").markdown.toHTML
        });
    });
}

function responseWithError(res, login, error, code)
{
    if(error.status !== undefined) {
        res.status(error.status);
    } else if(code !== undefined) {
        res.status(code);
    }

    res.render("article/body",
        {
            error: error.message,
            login: login
        }
    );
}


router.get("/article", (req, res) =>
    {
        var requestedArticle = req.query.article;
        var requestedVersion = req.query.version;

        if(req.query.forEdit) {
            res.forEdit = !!req.user;
        }

        try {
            processArticleRequest(res, req.user, requestedArticle, requestedVersion);
        } catch(err) {
            responseWithError(res, req.user, err, 500);
        }
    }
);

router.get("/article-versions", (req, res) =>
    {
        db.collection("article_versions").find({articleid: ObjectID(req.query.article.toString())}).toArray()
            .then((versions) => {
                if(versions.length === 0) {
                    throw StatusedError("No versions of this page", 404);
                }

                res.render("article/versions", {
                    title: versions[0].name,
                    versions: versions,
                    login: req.user
                });
            })
            .catch((err) => {
                responseWithError(res, req.user, err, 500);
            });
    }
);

router.get("/article-random", (req, res) =>
    {
        db.collection('articles').aggregate([{$sample: {size: 1}}]).toArray((err, articles) =>
        {
            if(err || !articles) {
                responseWithError(res, req.user, new Error("Error occurred"), 500);
            }

            res.redirect("/article?article=" + articles[0].name);
        });
    }
);


module.exports = router;
module.exports.responseWithError = responseWithError;
module.exports.StatusedError = StatusedError;
