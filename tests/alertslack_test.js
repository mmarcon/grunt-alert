var test = require('tape'),
    sinon = require('sinon');

var alertSlackBuilder = require('../lib/alertslack')

test('alert slack: missing Webhook URL', function(t){
    t.plan(3);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {};
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.false(request.called, 'Request has not been made');
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback clled');
});

test('alert slack: no optional options (success + error)', function(t){
    t.plan(5);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {
        webhookUrl: 'https://slack.com/123/456',
        message: 'Boo'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: config.webhookUrl,
        json: true,
        body: {
            text: config.message
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