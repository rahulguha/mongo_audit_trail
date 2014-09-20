/**
 * Created by rahulguha on 8/30/14.
 */
var express =       require('express'),
    bodyParser      = require('body-parser'),
    routes =        require('./routes.js'),
    config =        require('./config/config.json'),
    util =          require('./util.js'),
    _ =             require('lodash-node'),
    cors =          require('cors'),
    exphbs  =          require('express-handlebars');
    ;


// start logger
var logger =        util.get_logger("server");


// define routers (new in Express 4.0)
var ping_route      =   express.Router(),
    audit_route     =   express.Router(),
    audit_report_route     =   express.Router(),
    help_route      =   express.Router()
    ;




// start app
var app =           express();
app.use(bodyParser());  // for request body
app.use(cors());        // for x-browser


logger.info("express loaded");

// define view engine for help
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// protect any route starting with "audit" with validation
app.all("/audit/*", authenticate, function(req, res, next) {
    next(); // if the middleware allowed us to get here,
    // just move on to the next route handler
});
// implement ping_route actions

// This is specific way to inject code when this route is called
// This executes for any ping route.
// Similarly we can (and should) implement same for every route
ping_route.use (function(req,res,next){
    logger.info(util.create_routing_log(req.method, req.url, "ping", "PING"));
    // continue doing what we were doing and go to the route
    next();
});
    ping_route.get('/', function(req, res){
        res.send({'error' : 0, 'msg' : 'audit endpoints ready for data capture'});
    });
    ping_route.get('/check/mongo', function(req, res){
        res.send({'error' : 0, 'msg' : 'Code for checking Mongo connection will be implemented here'});
    });
    ping_route.post('/check/post', function(req, res){
        res.send('Checking Post Method' + req.body);
    });
app.use('/ping', ping_route);
// end ping route


// audit route implementation
audit_route.use (function(req,res,next){
    logger.info(util.create_routing_log(req.method, req.url, "audit", "AUDIT"));
    // continue doing what we were doing and go to the route
    next();
});
    audit_route.post('/insert/request', function(req, res){
        routes.insert_audit_request(req,res);
    });
app.use('/audit', audit_route);
// end audit route

// audit_report route implementation
audit_report_route.use (function(req,res,next){
    logger.info(util.create_routing_log(req.method, req.url, "audit/report", "AUDIT/REPORT"));
    // continue doing what we were doing and go to the route
    next();
});
    audit_report_route.get('/all', function(req, res){
        res.send('get all audit data');
    });
    audit_report_route.post('/by/app_id/:app_id', function(req, res){
        routes.get_audit_request_by_app_id(req,res);
    });
app.use('/audit/report', audit_report_route);
// end audit report route


// implement help_route actions
help_route.use (function(req,res,next){
    logger.info(util.create_routing_log(req.method, req.url, "help", "HELP"));
    // continue doing what we were doing and go to the route
    next();
});
help_route.get('/', function(req, res){
    var r_list = [];
    get_routes(ping_route.stack,r_list, "ping");
    get_routes(audit_route.stack,r_list, "audit");
    get_routes(audit_report_route.stack,r_list, "audit/report");
    get_routes(help_route.stack,r_list, "help");
    res.send(r_list);
});
help_route.get('/show', function(req, res){
    var r_list = [];
    get_routes(ping_route.stack,r_list, "ping");
    get_routes(audit_route.stack,r_list, "audit");
    get_routes(audit_report_route.stack,r_list, "audit/report");
    get_routes(help_route.stack,r_list, "help");
    //res.send(r_list);
    console.log(r_list);
    res.render('show', {'routes': r_list});
});
app.use('/help', help_route);
// end help route


// This function is used to extract route information from globally defined express router
// This will be refactored later for adding more features and making it more generic
var get_routes = function(r, r_list, route_sub_system){
    for (var i=0; i< r.length; i++){
        if (typeof r[i].route != "undefined"){

            r_list.push (
                {
                    'path': "/"+ route_sub_system + r[i].route.path,
                    'method':r[i].route.methods
                }

            )
        }
    }
    return r_list;
}


// This middleware function is used to protect the urls
// This will expect app id and secret key as body variable
// and it will validate based on registered data
function authenticate(req, res, next) {
    routes.auth(req,res, function (r){
        if (r.error == 0) {
            next(); // allow the next route to run
        } else {
            // some error occured which can be db connection or app/secret combination is wrong
            // but r will hold the err object which will have details
            // that can be handled in UI/consumer
            res.send(r); // or render a form, etc.
        }
    });

}

process.on('uncaughtException', function(err) {
    setTimeout(function() {
        console.log("Uncaught error happened");
        logger.info(util.create_routing_log("uncaught error", "uncaught error",  JSON.stringify(err) , "uncaught error- exitting"));
    }, 2000);
    console.log("Uncaught exception!", err);
});

logger.info("all routes are loaded");
app.listen(util.get_listening_port());
logger.info("http server started");
logger.info('Listening to port ' + util.get_listening_port());
module.exports = app;