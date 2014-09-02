/**
 * Created by rahulguha on 8/12/14.
 */
var mongodb = require('mongodb'),
    util = require('../util.js');
"use strict";


var host = util.get_mongo_host();
var db = util.get_mongo_host_db();


var port =  27017;

console.log("Connecting to " + host + ":" + port);
module.exports.init = function ( callback) {
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

module.exports.get_collection = function (client, collection, callback) {
    module.exports.coll = new mongodb.Collection(client, collection);
    callback(error);
};


