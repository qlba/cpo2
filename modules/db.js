
const connString = "mongodb://127.0.0.1:27017/wikiengine";
const mongodb = require("mongodb");

exports.init = function (options, callback)
{
    mongodb.MongoClient.connect(connString, options,
        function(err, db)
        {
            if(err) {
                callback(err, null);
            } else {
                db.ObjectID = mongodb.ObjectID;
                module.exports = db;

                callback(null, db);
            }
        }
    );
};


// {
//     for (var i in db) {
//         exports[i] = db[i];
// }