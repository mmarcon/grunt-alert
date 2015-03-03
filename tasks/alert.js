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

function injectAlertHook(grunt) {
    grunt._fatal = grunt.fail.fatal;
    grunt._warn = grunt.fail.warn;

    grunt.log.writeln('injecting hooks');

    grunt.fail.fatal = grunt.fatal = function(error, errorcode){
        grunt.option('alert.fail', 'fatal');
        grunt.option('alert.error', error);
        grunt.option('alert.code', errorcode);
        grunt.task.run('alert');
        grunt.task.run('_alert.fatal');
    };

    grunt.fail.warn = grunt.warn =function(error, errorcode){
        grunt.option('alert.fail', 'warn');
        grunt.option('alert.error', error);
        grunt.option('alert.errorcode', errorcode);
        grunt.task.run('alert');
        grunt.task.run('_alert.warn');
    };
}

module.exports = function(grunt) {

    grunt.registerTask('alert.hook', function(){
        injectAlertHook(grunt);
        return;
    });

    grunt.registerTask('_alert.warn', function(){
        grunt._warn(this.option('alert.error'), this.option('alert.errorcode'));
        return;
    });

    grunt.registerTask('_alert.fatal', function(){
        grunt._fatal(this.option('alert.error'), this.option('alert.errorcode'));
        return;
    });

    grunt.registerMultiTask('alert', 'Sends alerts about failing builds using different channels', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var config = this.data,
            target = this.target,
            done = this.async();

        console.log(config);

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