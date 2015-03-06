var test = require('tape'),
    sinon = require('sinon');

var alertSlackBuilder = require('../lib/alertslack');

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
    t.true(callback.called, 'Callback called');
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
    t.true(callback.called, 'Callback called');

    callback.reset();
    requestCallbackFn(new Error('foo'), {}, null);
    t.true(grunt.log.error.called, 'Error logged');
    t.true(callback.called, 'Callback called');
});

test('alert slack: with icon', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {
        webhookUrl: 'https://slack.com/123/456',
        message: 'Boo',
        iconUrl: 'https://placekitten.com/g/200/300'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: config.webhookUrl,
        json: true,
        body: {
            text: config.message,
            icon_url: config.iconUrl
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert slack: with emoji', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {
        webhookUrl: 'https://slack.com/123/456',
        message: 'Boo',
        iconEmoji: ':beer:'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: config.webhookUrl,
        json: true,
        body: {
            text: config.message,
            icon_emoji: config.iconEmoji
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert slack: post to channel', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {
        webhookUrl: 'https://slack.com/123/456',
        message: 'Boo',
        channel: '#gruntalert'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: config.webhookUrl,
        json: true,
        body: {
            text: config.message,
            channel: config.channel
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert slack: post with username', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {
        webhookUrl: 'https://slack.com/123/456',
        message: 'Boo',
        username: 'Grunt Alert'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: config.webhookUrl,
        json: true,
        body: {
            text: config.message,
            username: config.username
        },
        method: 'POST'
    }, 'Request configuration is correct');
});

test('alert slack: with all options (emoji ignored since icon is set)', function(t){
    t.plan(2);

    var request = sinon.spy();
    var alertSlack = alertSlackBuilder(request);

    var config = {
        webhookUrl: 'https://slack.com/123/456',
        message: 'Boo',
        iconUrl: 'https://placekitten.com/g/200/300',
        iconEmoji: ':beer:',
        channel: '#gruntalert',
        username: 'Grunt Alert'
    };
    var grunt = { log: { error: sinon.spy() } };
    var callback = sinon.spy();


    alertSlack(config, grunt, callback);

    t.true(request.called, 'Request has been made');

    t.deepEqual(request.lastCall.args[0], {
        url: config.webhookUrl,
        json: true,
        body: {
            text: config.message,
            icon_url: config.iconUrl,
            channel: config.channel,
            username: config.username
        },
        method: 'POST'
    }, 'Request configuration is correct');
});