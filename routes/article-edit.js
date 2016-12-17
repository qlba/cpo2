
var router = require("express").Router(),
    db = require("../modules/db.js"),
    ObjectID = require("mongodb").ObjectID,
    responseWithError = require("./article").responseWithError;


function canEdit(login, owner)
{
    return login && (login._id.toString() === owner.toString());
}

function findAndCheckPermissions(login, id)
{
    return db.collection("article_versions").findOne({_id: ObjectID(id)})
        .then((version) =>
        {
            if (!version) {
                throw new Error("Version not found");
            }

            if (!canEdit(login, version.owner)) {
                throw new Error("Operation not permitted");
            }

            return version;
        });
}

function alterVersionAndRespond(req, res, callback)
{
    findAndCheckPermissions(req.user, req.body.aid)
        .then((version) =>
        {
            callback(version);
            version.updated = new Date();

            return db.collection("article_versions").save(version);
        })
        .then(() => {
            res.redirect("back");
        })
        .catch((err) => {
            responseWithError(res, req.user, err);
        });
}


router.post("/article-edit-section", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.content[req.body.asid].text = req.body.newcontent;
    });
});

router.post("/article-rename-section", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.content[req.body.asid].name = req.body.newname;
    });
});

router.post("/article-delete-section", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.content.splice(req.body.asid, 1);
    });
});

router.post("/article-insert-section", (req, res) =>
{
    var section = +req.body.asid + 1;

    alterVersionAndRespond(req, res, (version) => {
        version.content.content.splice(section, 0, {
            "name": "New section " + section,
            "text": ""
        });
    });
});

router.post("/article-edit-brief", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.brief = req.body.newcontent;
    });
});

router.post("/article-rename-table", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.tableName = req.body.newname;
    });
});

router.post("/article-edit-table", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.table = parseTable(req.body.newcontent);
    });
});

router.post("/article-edit-links", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {
        version.content.links = parseLinks(req.body.newcontent);
    });
});

router.post("/article-upload-image", (req, res) =>
{
    alterVersionAndRespond(req, res, (version) => {

        var image = req.files.image,
            imageHash = require("crypto").createHash("sha256").update(image.data).digest("hex"),
            imageUrl = "/images/" + imageHash;

        image.mv(process.cwd() + "/public" + imageUrl, (error) => {
            if(error)
                throw error;
        });

        var oldImage = version.content.image;
        version.content.image = imageUrl;

        db.collection("article_versions").findOne({_id: {$ne: version._id}, "content.image": oldImage}, (err, doc) => {

            if(err) {
                throw err;
            }

            if(!doc) {
                require("fs").unlinkSync(process.cwd() + "/public" + oldImage);
            } else {
                console.log("File " + oldImage + " is on usage by version " + doc._id);
            }

        });
    });
});


router.post("/article-clone", (req, res) =>
{
    if(!req.user) {
        return responseWithError(res, req.user, new Error("Not logged in to edit"));
    }

    db.collection("article_versions").findOne({_id: ObjectID(req.body.aid.toString())})
        .then((version) =>
        {
            if(!version) {
                throw new Error("Error while cloning");
            }

            delete version._id;

            version.owner = req.user._id;
            version.ownerName = req.user.username;
            version.created = new Date();
            version.updated = new Date();
            version.discussion = {};
            version.ratings = [];

            return db.collection("article_versions").insert(version);
        })
        .then((newVersion) =>
        {
            res.redirect("/article?version=" + newVersion.insertedIds[1].id.toString('hex') + "&forEdit=1");
        })
        .catch((err) => {
            responseWithError(res, req.user, err);
        });
});


router.get("/article-create", (req, res) =>
{
    if(!req.user) {
        return responseWithError(res, req.user, new Error(
            "You must be logged in to create articles"));
    }

    db.collection("articles").findOne({name: req.query.article})
        .then((article) =>
        {
            if (article) {
                throw new Error("Article already exists");
            }


            article = {
                name: req.query.article,
                main_version: ""
            };

            return db.collection("articles").insert(article);
        })
        .then((newArticle) =>
        {
            var version = {
                owner: req.user._id,
                articleid: ObjectID(newArticle.insertedIds[1].id),
                name: req.query.article,
                ownerName: req.user.username,
                created: new Date(),
                updated: new Date(),
                discussion: {},
                ratings: [],
                content: {
                    brief: "",
                    image: "",
                    tableName: "",
                    table: [],
                    content: [],
                    links: []
                }
            };

            return db.collection("article_versions").insert(version);
        })
        .then((newVersion) =>
        {
            return db.collection("articles").update({name: req.query.article}, {$set: {main_version: ObjectID(newVersion.insertedIds[1].id)}});
        })
        .then(() =>
        {
            res.redirect("/article?article=" + req.query.article + "&forEdit=1");
        })
        .catch((err) => {
            responseWithError(res, req.user, err);
        });
});



function parseTable(str)
{
    var result = [];

    str
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n\n").forEach((row) =>
    {
        var rowComponents = row.split("\n");

        if(!rowComponents[0]) {
            return;
        }

        result.push({
            k: rowComponents.shift(),
            v: rowComponents.join("\n")
        });
    });

    return result;
}

function parseLinks(str)
{
    var result = [];

    str
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n\n").forEach((row) =>
    {
        var rowComponents = row.split("\n");

        if(!rowComponents[0]) {
            return;
        }

        result.push({
            label: rowComponents.shift(),
            url: rowComponents.join("\n")
        });
    });

    return result;
}

module.exports = router;
