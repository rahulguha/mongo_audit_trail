/**
 * Created by rahulguha on 17/09/14.
 */
var app = require('../audit')
    , request = require('supertest');
describe('ping api', function(){
    describe('requesting  /ping using GET method', function(){
        it('should respond with 200', function(done){
            request(app)
                .get('/ping')
                .expect('Content-Type', /json/)
                .expect(200, done);
        }); });
    describe('requesting /ping/check/mongo using GET method', function(){
        it('should respond with 200', function(done){
            request(app)
                .get('/ping/check/mongo')
                .expect('Content-Type', /json/)
                .expect(200, done);
        }); });
    describe('requesting resource /ping/check/post using POST method', function(){
        it('should respond with 200', function(done){
            request(app)
                .post('/ping/check/post')
                //.expect('Content-Type', /text/html/)
                .expect(200, done);
        }); });
});