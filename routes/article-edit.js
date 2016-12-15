
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
            responseWithError(res, null, err);
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


router.post("/article-clone", (req, res) =>
{
    new Promise((resolve, reject) => {
        if(!req.user) {
            return reject(new Error("Not logged in to edit"));
        }

        return resolve();
    })
        .then(() =>
        {
            return db.collection("article_versions").findOne({_id: ObjectID(req.body.aid.toString())});
        })
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
            responseWithError(err);
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

        result.push({
            k: rowComponents.shift(),
            v: rowComponents.join("\n")
        });
    });

    return result;
}

module.exports = router;
