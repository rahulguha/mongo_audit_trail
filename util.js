/**
 * Created by rahulguha on 22/02/14.
 */
var config =require('./config/config.json'),
    _ = require('lodash-node'),
    log4js = require('log4js');

log4js.configure('./config/log4js.json', {});

function AWS () {
    this.AWS_Key = null;
    this.AWS_SECRET = null;
}

function util() {
    this.get_logger = function(log){
        var logger = log4js.getLogger(log);
        logger.setLevel(config.logging_level);
        return logger;
    };

    this.get_listening_port = function(){
        return config.port;
    };

    this.get_connection_string = function(){
        var e = config.env;
        var mongo_address = _.find(config.mongo_address, function(env) {
            return env.env == e;
        });

        return  "mongodb://" + mongo_address.ip + "/" + config.db + "?poolSize=4";
    };

    this.get_db_user = function(product){
        if (product == "mongo") {
            // todo
            return null;
        } else {
            return config.mysql.user_id;
        }
    };

    this.get_db_pwd = function(product){
        if (product == "mongo"){
            // todo
            return null;
        } else {
            return config.mysql.password;
        }
    };

    this.get_db = function(product){
        if (product == "mongo"){
            // todo
            return null;
        } else {
            return config.mysql.db;
        }
    }; 

    this.get_mongo_host = function (){
        var e = config.env;
        var address = _.find(config.mongo_address, function(env) {
            return env.env == e;
        });

        return address.ip;
    };

    this.get_mongo_host_db = function (){
        var e = config.env;
        var address = _.find(config.mongo_address, function(env) {
            return env.env == e;
        });

        return address.db;
    };

    this.get_mongo_host_collection = function (){
        var e = config.env;
        var address = _.find(config.mongo_address, function(env) {
            return env.env == e;
        });

        return address.collection;
    };

    this.get_mongo_host_auth_collection = function (){
        var e = config.env;
        var address = _.find(config.mongo_address, function(env) {
            return env.env == e;
        });

        return address.auth_collection;
    };

    this.get_connection_string = function(product){
        var e = config.env;
        var connection_string ;
        if (product == "mongo"){
            var address = _.find(config.mongo_address, function(env) {
                return env.env == e;
                 });
            connection_string = "mongodb://" + address.ip + "/" + config.db + "?poolSize=4";
         } else { // for mysql
            var address = _.find(config.mysql.address, function(env) {
                return env.env == e;
            });
            connection_string = address;
        }

        return connection_string;
    };  

    this.get_connection_string_byip = function(product,ip) {
        var e = "client";
        var connection_string ;
        if (product == "mongo") {
            var address = _.find(config.mongo_address, function(env) {
                return (env.env == e && env.ip==ip);
                 });
            connection_string = "mongodb://" + address.ip + "/" + address.db + "?poolSize=4";
         }
        else { // for mysql
            var address = _.find(config.mysql.address, function(env) {
                return env.env == e;
            });
            connection_string = address;
        }

        return connection_string;
    };

    this.get_logging_level = function(){
        return config.logging_level;
    };

    this.get_email_info = function(){
        return config.email_info;
    };

    this.get_email_templating_engine = function(engine){
        var engine_info = _.find(config.email_templating_engine, function(template_info) {
            return template_info.name == engine;
        });

        return engine_info;
    };

    this.get_aws = function () {
        var aws = new AWS();
        aws.AWS_KEY = config.AWS.AWS_KEY;
        aws.AWS_SECRET = config.AWS.AWS_SECRET;

        return aws;
    };

    this.create_routing_log = function (method, url, prefix, route) {
        var tmp = "Route Sub System: " + route + "\n" + "Method: " + method + "\n" + "URL:" + "/" + prefix  + url;
        
        return tmp;
    };

    this.get_source_by_query_purpose = function(query_purpose) {
        var source = _.find(config.query_setup, function(q) {
            return (q.purpose == query_purpose);
        });

        return source;
    };
}

module.exports = new util();