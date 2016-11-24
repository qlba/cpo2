/**
 * Created by qlba on 17.11.2016.
 */

var connector = require('./generic')('127.0.0.1', 27017);

module.exports = 
function(collName) {
    return new Promise(function(resolve, reject) {
        connector('wikiengine', collName, function (err, collection) {
            err ? reject(err) : resolve(collection);
        });
    });
};
