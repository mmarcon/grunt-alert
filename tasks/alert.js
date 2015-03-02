/*
 * grunt-alert
 * https://github.com/mmarcon/grunt-alert
 *
 * Copyright (c) 2015 Massimiliano Marcon
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');

var supportedTypes = /slack/;

function alertSlack(config, grunt, done) {
    var payload = {},
        url = config.webhookUrl;

    if(!url) {
        grunt.log.error('Webhook URL for Slack is not set');
        done();
    }

    if(config.iconUrl) {
        payload.icon_url = config.iconUrl;
    } else if(config.iconEmoji) {
        payload.icon_emoji = config.iconEmoji;
    }

    config.message = config.message || 'Error: {ERROR}';
    payload.text = config.message/*.replace('{ERROR}', error)*/;

    if(config.channel) {
        payload.channel = config.channel;
    }

    if(config.username) {
        payload.username = config.username;
    }

    request({
        url: url,
        json: true,
        body: payload
    }, function(e, r, body){
        if(e) {
            grunt.log.error('Failed to post to slack: ' + JSON.stringify(e));
            done();
        }
        grunt.log.writeln(body);
        done(body);
    });
}

module.exports = function(grunt) {

    grunt.registerMultiTask('alert', 'Sends alerts about failing builds using different channels', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var config = this.data,
            target = this.target,
            done = this.async();

        // If type is set, we'll use that as the alerting
        // platform name. If not, we'll try to use the target
        // name as the platform name.
        // This basically means that
        // alert: {
        //    foo: { type: 'slack' }
        // }
        // is equivalent to
        // alert: {
        //    slack: {}
        // }
        config.type = config.type || target;

        //Now, let's check if we support that platform
        if(!supportedTypes.test(config.type)) {
            grunt.log.error('The platform ' + config.type + ' is not supported');
            return done();
        }

        switch(config.type) {
            case 'slack':
                return alertSlack(config, grunt, done);
        }
    });

};