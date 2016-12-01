/**
 * Created by qlba on 01.12.2016.
 */

const connString = "mongodb://127.0.0.1:27017/wikiengine";

module.exports.init = function (options, callback)
{
    require("mongodb").MongoClient.connect(connString, options,
        function(err, db) {
            if(err)
                callback(err, null);
            else {
                module.exports = db;
                callback(null, db);
            }
        }
    );
};
