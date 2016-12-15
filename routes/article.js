
var router = require("express").Router(),
    db = require("../modules/db.js"),
    ObjectID = db.ObjectID;


function processArticleRequest(res, login, req_article, req_version)
{
    if(req_version) {
        responseWithArticleVersion(res, login, req_version);
    } else if(req_article) {
        responseWithArticle(res, login, req_article);
    } else {
        throw new Error("Bad request");
    }
}

function responseWithArticle(res, login, req_article)
{
    var query = {name: req_article[0] === '#' ? {$regex: req_article.substr(1)} : req_article};

    db.collection('articles').find(query).toArray((err, articles) => {
        switch (articles.length) {
            case 0:
                throw new Error("No such article");
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
            throw err;
        }

        if(!version) {
            throw new Error("Article version not found");
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

function responseWithError(res, login, error)
{
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
            responseWithError(res, req.user, err);
        }
    }
);

router.get("/article-versions", (req, res) =>
    {
        db.collection("article_versions").find({articleid: ObjectID(req.query.article.toString())}).toArray()
            .then((versions) => {
                if(versions.length === 0) {
                    throw new Error("No versions of this page");
                }

                res.render("article/versions", {
                    title: versions[0].name,
                    versions: versions
                });
            })
            .catch((err) => {
                responseWithError(res, req.user, err);
            });
    }
);

router.get("/article-random", (req, res) =>
    {
        db.collection('articles').aggregate([{$sample: {size: 1}}]).toArray((err, articles) =>
        {
            if(err || !articles) {
                responseWithError(res, req.user, new Error("Error occurred"));
            }

            res.redirect("/article?article=" + articles[0].name);
        });
    }
);


module.exports = router;
module.exports.responseWithError = responseWithError;
