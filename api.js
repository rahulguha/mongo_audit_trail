/**
 * Created with JetBrains WebStorm.
 * User: Rahul
 * Date: 22/2/14
 * Time: 6:16 AM
 * To change this template use File | Settings | File Templates.
 */
/* The API controller
 Exports 3 methods:
 * post - Creates a new thread
 * list - Returns a list of threads
 * show - Displays a thread and its posts
 */


"use strict";

var shortid = require('shortid'),
    _ = require('lodash-node'),
    util = require('./util.js'),
    logger = util.get_logger("api"),
    async = require('async'),
    mongo = require('./db_connect/mongo.js'),
    logger = util.get_logger("api");

//audit object
var audit = function() {
    this.audit_id = "";
    this.app_id = "";
    this.db_name = "";
    this.collection_name = "";
    this.field_name = "";
    this.business_id ="";
    this.old_data = "";
    this.new_data  = "";
    this.ts = "";
    this.user = "";
};

//private helper functions
var send_to_response = function(results, res ) {
    if (results instanceof Array) {
        var arr = [];
        results.forEach(function(r){
            arr.push(r)

        });
    } else {
        var arr = results;
    }
    res.contentType('application/json');
    res.send(arr);
};

var return_back  = function(results ) {
    var arr = [];
    results.forEach(function(claim){
        arr.push(claim)
    });
    return arr;
};

var exec_mongo_call = function(q) {
    var result = mongo_native_exec.get_data(q, "schneider", "sales_registry");
    return result;
};

var log_info = function(fp, q, error_flag) {
    if (!error_flag){
        logger.info("query - " + fp + " successful - " + JSON.stringify(q));
    } else {
        logger.info("query - " + fp + " failed - " + JSON.stringify(q));
    }
};

function api() {

    // This looks into persistent registry of apps that participates
    // into the audit trail
    this.autheticate = function (req, res, callback) {
        try {
            mongo.init(function (error, mongo_client) {
                if (error)
                    throw error;
                else {
                    var r = {};
                    var c = mongo_client.collection(util.get_mongo_host_auth_collection());

                    if (req.body.hasOwnProperty("app_id") &&
                            req.body.hasOwnProperty("secret") &&
                            req.body.app_id != '' &&
                            req.body.secret != ''
                        ) {
                        var q = {'app_id': req.body.app_id, 'secret' : req.body.secret};
                        c.find(q).toArray( function(err, docs){
                            if (err){
                                log_info ('autheticate error', err, true);
                                r.error  = 1;
                                r.result = err;
                            }
                            else{
                                log_info ('autheticate', q, false);
                                if (docs.length > 0 ){
                                    r.error = 0;
                                    r.result = docs;
                                    //return ({'error': 0, 'result' : docs}, res);
                                }else{
                                    r.error  = 1;
                                    r.result = "app/secret combination not correct";
                                }
                            }
                            callback( r);
                        })
                    }
                    else {
                        log_info ('autheticate error', {'error': 1, 'err_obj' : "app_id / secret not present in request"}, true);
                        r.error  = 1;
                        r.result = "app_id / secret not present in request";
                        callback(r);
                    }
                }

            });
        }
        catch (exception) {
            logger.info(exception);
        }
    };

    //get methods
    this.get_audit_request_by_app_id = function (req, res) {
        try {
            mongo.init(function (error, mongo_client) {
                if (error)
                    throw error;
                else {
                    var c = mongo_client.collection(util.get_mongo_host_collection());
                    var q = {'app_id': req.params.app_id};

                    c.find(q).toArray(function(err, docs) {
                        if (err){
                            log_info ('get_audit_request_by_app_id', err, true);
                            send_to_response(err, res);
                        } else {
                            log_info ('get_audit_request_by_app_id', q, false);
                            send_to_response(docs, res);
                        }
                    })
                }
            });
        }
        catch (exception) {
            logger.info(exception);
        }
    };

    /*
        post methods.
        This inserts a record in email_request collection which will later be picked up for processing.
        This method caters to to the simple case where all data are provided by the post message.
    */
    this.insert_audit_request = function (req, res) {
        try {
            mongo.init(function (error, mongo_client) {
                if (error)
                    throw error;
                else {
                    var a = new audit();
                    a.audit_id = req.body.app_id + "-" + shortid.generate();
                    a.app_id = req.body.app_id;
                    a.db_name = req.body.db_name;
                    a.collection_name = req.body.collection_name;
                    a.field_name = req.body.field_name;
                    a.business_id = req.body.business_id;
                    a.business_id_name = req.body.business_id_name;
                    a.old_data = req.body.old_data;
                    a.new_data = req.body.new_data;
                    a.ts = new Date();
                    a.user = req.body.user;
                    var c = mongo_client.collection(util.get_mongo_host_collection());
                    c.insert(a, function(err, docs){
                        if (err) {
                            log_info ('insert_audit_request', err, true);
                            send_to_response(err, res);
                        } else {
                            log_info ('insert_audit_request', a, false);
                            send_to_response(docs, res);
                        }
                    })
                }
            });
        }
        catch (exception) {
            logger.info(exception);
        }
    };
}

module.exports = new api();