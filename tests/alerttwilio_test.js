var test = require('tape'),
    sinon = require('sinon');

var alertTwilioBuilder = require('../lib/alerttwilio');

test('alert twilio: missing token and account', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert twilio: missing token', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {account: 'abc'};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert twilio: missing account', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {token: '123'};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert twilio: missing from and to', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {token: '123', account: 'abc'};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert twilio: missing from', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {token: '123', account: 'abc', to: '+49123456'};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert twilio: missing to', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {token: '123', account: 'abc', from: '+1123456'};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert twilio: success + error', function(t){
    t.plan(5);

    var request = sinon.spy();
    var alertTwilio = alertTwilioBuilder(request);

    var config = {
        token: '123',
        account: 'abc',
        from: '+1123456',
        to: '+49123456',
        message: 'Boo'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertTwilio(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: 'https://api.twilio.com/2010-04-01/Accounts/abc/Messages.json',
        form: {
            Body: config.message,
            From: config.from,
            To: config.to
        },
        auth: {
            user: config.account,
            pass: config.token,
            sendImmediately: true
        },
        method: 'POST'
    }, 'Request configuration is correct');

    var requestCallbackFn = request.lastCall.args[1];

    requestCallbackFn(null, {}, null);
    t.true(callback.called, 'Callback called');

    callback.reset();
    requestCallbackFn(new Error('foo'), {}, null);
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});