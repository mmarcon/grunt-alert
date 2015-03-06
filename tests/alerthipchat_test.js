var test = require('tape'),
    sinon = require('sinon');

var alertHipchatBuilder = require('../lib/alerthipchat');

test('alert hipchat: missing room', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert hipchat: missing token', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {room: 'grunt'};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert hipchat: no optional options (success + error)', function(t){
    t.plan(5);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'html',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');

    var requestCallbackFn = request.lastCall.args[1];

    requestCallbackFn(null, {}, null);
    t.true(callback.called, 'Callback clled');

    callback.reset();
    requestCallbackFn(new Error('foo'), {}, null);
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback clled');
});

test('alert hipchat: with text format', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        messageFormat: 'text'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'text',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert hipchat: with html format', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        messageFormat: 'html'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'html',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert hipchat: with invalid format', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        messageFormat: 'json'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'html',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert hipchat: with custom valid color', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        color: 'red'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'red',
            message_format: 'html',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert hipchat: with custom invalid color', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        color: 'tomato'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'html',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert hipchat: with notification', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        notify: true
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'html',
            notify: true
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert hipchat: without notification', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertHipchat = alertHipchatBuilder(request);

    var config = {
        room: 'grunt',
        token: '123456',
        message: 'Boo',
        notify: false
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertHipchat(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.hipchat.com/v2/room/grunt/notification',
        json: true,
        body: {
            message: config.message,
            color: 'yellow',
            message_format: 'html',
            notify: false
        },
        headers: {
            'Authorization': 'Bearer ' + config.token
        },
        method: 'POST'
    }, 'Request configuration is correct');
});