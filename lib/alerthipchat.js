/*request is injected*/

var DEFAULT_CONFIG = {};
DEFAULT_CONFIG.HIPCHAT_URL = 'https://api.hipchat.com/v2/room/{ROOM}/notification';
DEFAULT_CONFIG.VALID_COLORS = /yellow|green|red|purple|gray|random/;
DEFAULT_CONFIG.VALID_FORMATS = /text|html/;

module.exports = function(request){
    return function alertHipchat(config, grunt, done, logger) {
        var payload = {},
            url = config.endpoint || DEFAULT_CONFIG.HIPCHAT_URL;

        if(!config.room) {
            grunt.log.error('HipChat room not set');
            logger.error('HipChat room not set');
            return done();
        }

        if(!config.token) {
            grunt.log.error('HipChat authorization token not set');
            logger.error('HipChat authorization token not set');
            return done();
        }

        url = url.replace('{ROOM}', config.room);

        payload.message = config.message;
        payload.message_format = DEFAULT_CONFIG.VALID_FORMATS.test(config.messageFormat) ? config.messageFormat : 'html';
        payload.notify = !!config.notify;

        payload.color = DEFAULT_CONFIG.VALID_COLORS.test(config.color) ? config.color : 'yellow';

        request({
            url: url,
            json: true,
            body: payload,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + config.token
            }
        }, function(e, r, body){
            if(e) {
                grunt.log.error('Failed to post to HipChat: ' + JSON.stringify(e));
                logger.error('Failed to post to HipChat: ' + JSON.stringify(e));
                return done();
            }
            logger.log('Successfully posted to HipChat <' + config.message + '>');
            return done(body);
        });
    };
};