/**
 * Created with JetBrains WebStorm.
 * User: Rahul
 * Date: 21/2/14
 * Time: 9:06 PM
 * To change this template use File | Settings | File Templates.
 */
 "use strict";
var api = require('./api.js');

function routes() {

	this.insert_audit_request = function (req, res) {
    	api.insert_audit_request(req, res);
	};

	this.get_audit_request_by_app_id = function (req, res) {
    	api.get_audit_request_by_app_id(req, res);
	};

	this.auth = function (req, res,callback) {
    	api.autheticate(req,res,  function (r){
        	callback( r);
    	});
	};
}

module.exports = new routes();


