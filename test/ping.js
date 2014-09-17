/**
 * Created by rahulguha on 17/09/14.
 */
var app = require('../audit')
    , request = require('supertest');
describe('ping api', function(){
    describe('when requesting resource /ping', function(){
        it('should respond with 200', function(done){
            request(app)
                .get('/ping')
                .expect('Content-Type', /json/)
                .expect(200, done);
        }); });
    describe('when requesting resource /ping/check/mongo', function(){
        it('should respond with 200', function(done){
            request(app)
                .get('/ping/check/mongo')
                .expect('Content-Type', /json/)
                .expect(200, done);
        }); });
});