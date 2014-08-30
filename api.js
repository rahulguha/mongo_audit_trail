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
var
    shortid = require('shortid'),
    _ = require('lodash-node');
var util = require('./util.js');
var logger = util.get_logger("api");
var async = require('async');
var mongo = require('./db_connect/mongo.js');



"use strict";
var logger =        util.get_logger("api");
// ********************  audit object   *************************************
var audit = function(){
    this.audit_id = "";
    this.app_id = "";
    this.db_identifier = "";
    this.collection_identifier = "";
    this.field_identifier = "";
    this.old_data = "";
    this.new_data  = "";
    this.ts = "";
    this.user = "";
}

//******************** end  audit object *************************************

//********************  get  methods   *************************************
exports.get_audit_request_by_app_id = function (req, res) {
    try{
        mongo.init(  function (error, mongo_client) {
            if (error)
                throw error;
            else {

                var c = mongo_client.collection(util.get_mongo_host_collection());
                var q = {'app_id': req.params.app_id};
                c.find(q).toArray( function(err, docs){
                    if (err){
                        log_info ('get_audit_request_by_app_id', err, true);
                        send_to_response(err, res);
                    }
                    else{
                        log_info ('get_audit_request_by_app_id', q, false);
                        send_to_response(docs, res);
                    }
                })

            }
        });
    }
    catch (exception){
        logger.info(exception);
    }

};
//******************** end  get *************************************

//********************  post methods   *************************************

// This inserts a record in email_request collection which will later be picked up for processing
// This method caters to to the simple case where all data are provided by the post message
exports.insert_audit_request = function (req, res) {
    try{
        mongo.init(  function (error, mongo_client) {
            if (error)
                throw error;
            else {
                var a = new audit();
                a.audit_id = req.body.app_id + "-" + shortid.generate();
                a.app_id = req.body.app_id;
                a.db_identifier = req.body.db_identifier;
                a.collection_identifier = req.body.collection_identifier;
                a.field_identifier = req.body.field_identifier;
                a.old_data = req.body.old_data;
                a.new_data = req.body.new_data;
                a.ts = new Date();
                a.user = req.body.user;
                var c = mongo_client.collection(util.get_mongo_host_collection());
                c.insert(a, function(err, docs){
                    if (err){
                        log_info ('insert_audit_request', err, true);
                        send_to_response(err, res);
                    }
                    else{
                        log_info ('insert_audit_request', a, false);
                        send_to_response(docs, res);
                    }
                })

            }
        });
    }
    catch (exception){
        logger.info(exception);
    }

};


//******************** end  post *************************************


// ******************* private helper functions ***********************
var send_to_response = function(results, res ){
    if (results instanceof Array){
        var arr = [];
        results.forEach(function(r){
            arr.push(r)

        });
    }
    else{
        var arr = results;
    }
    res.contentType('application/json');
    res.send(arr);
}
var return_back  = function(results ){
    var arr = [];
    results.forEach(function(claim){
        arr.push(claim)
    });
    return arr;
}

var exec_mongo_call = function(q){
    var result = mongo_native_exec.get_data(q, "schneider", "sales_registry");
    return result;
}

var log_info = function(fp, q, error_flag){
    if (!error_flag){
        logger.info("query - " + fp + " successful - " + JSON.stringify(q));
    }
    else {
        logger.info("query - " + fp + " failed - " + JSON.stringify(q));
    }

}


// ******************* private helper functions ***********************

