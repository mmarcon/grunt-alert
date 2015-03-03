/*
 * grunt-alert
 * https://github.com/mmarcon/grunt-alert
 *
 * Copyright (c) 2015 Massimiliano Marcon
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        alert: {
            slack: {
                type: 'slack',
                webhookUrl: '',
                channel: '#grunt',
                username: 'Grunt Alert',
                iconUrl: '',
                iconEmoji: ':ghost:',
                message: 'Ya\'ll suck. The build just failed with this error: %s'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['clean']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

    grunt.registerTask('warn', 'tests warn failure', function(){
        grunt.warn('this task has failed with a warning. i guess you\'ll survive');
    });

    grunt.registerTask('fatal', 'tests fatal failure', function(){
        grunt.fatal('this task has failed with a fatal error. you will all die.');
    });

    grunt.registerTask('catchwarn', ['alert.hook', 'warn']);
    grunt.registerTask('catchfatal', ['alert.hook', 'fatal']);
};