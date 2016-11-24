/**
 * Created by qlba on 17.11.2016.
 */


/* Actual requisites */
/*
const dbName = 'wikiengine';
const dbHost = 'localhost';
const dbPort = 27017;

app.set('dbName', 'wikiengine');
app.set('dbHost', '127.0.0.1');
app.set('dbPort', 27017);
*/


module.exports =
    function(host, port)
    {
        var mongoDatabases = {};

        var ensureDatabase =
            function(dbName, readyCallback)
            {
                if(mongoDatabases[dbName])
                {
                    readyCallback(null, mongoDatabases[dbName]);
                    return;
                }

                var server = new require('mongodb').Server(host, port, {auto_reconnect: true});
                var db = new require('mongodb').Db(dbName, server);

                db.open(
                    function(error, databaseConnection)
                    {
                        if(error)
                            throw error;

                        mongoDatabases[dbName] = databaseConnection;

                        databaseConnection.on('close',
                            function()
                            {
                                delete(mongoDatabases[dbName]);
                            }
                        );

                        readyCallback(error, databaseConnection);
                    }
                );
            };

        return function(dbName, collectionName, readyCallback)
        {
            ensureDatabase(dbName,
                function(error, databaseConnection)
                {
                    if(error)
                        throw error;

                    databaseConnection.createCollection(collectionName,
                        function(error, collection)
                        {
                            if(error)
                                throw error;

                            readyCallback(error, collection);
                        }
                    )
                }
            );
        };
    };
