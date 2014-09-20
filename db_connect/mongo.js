/**
 * Created by rahulguha on 8/12/14.
 */
 "use strict";
var mongodb = require('mongodb'),
    util = require('../util.js'),
    host = util.get_mongo_host(),
    db = util.get_mongo_host_db(),
    port =  27017;

//use logger instead
console.log("Connecting to " + host + ":" + port);

function mongo() {
    this.init = function ( callback) {
        var server = new mongodb.Server(host, port, {});
        var mongo_client;
        mongodb.Db(db, server, {w: -1})
            .open(function (error, client) {
                if (error){
                    console.log("error connecting to MongoDB in Native driver");
                }
                else{
                    mongo_client = client;
                    callback(null,client);
                }
            });

    };

    this.get_collection = function (client, collection, callback) {
        module.exports.coll = new mongodb.Collection(client, collection);
        callback(error);
    };
}

module.exports = new mongo();


