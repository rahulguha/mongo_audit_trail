/**
 * Created with JetBrains WebStorm.
 * User: Rahul
 * Date: 21/2/14
 * Time: 9:06 PM
 * To change this template use File | Settings | File Templates.
 */
//var cat = require('../schema/category.js');
var api = require('./api.js');

exports.insert_audit_request = function (req, res) {
    api.insert_audit_request(req, res);
};
exports.get_audit_request_by_app_id = function (req, res) {
    api.get_audit_request_by_app_id(req, res);
};
