/*request is injected*/

var DEFAULT_HIPCHAT_URL = 'https://api.hipchat.com/v2/room/{room}/notification';

module.exports = function(request){
    return function alertHipchat(config, grunt, done) {
        var payload = {},
            url = config.endpoint || DEFAULT_HIPCHAT_URL;

        if(!url) {
            grunt.log.error('Webhook URL for Slack is not set');
            return done();
        }

        if(config.iconUrl) {
            payload.icon_url = config.iconUrl;
        } else if(config.iconEmoji) {
            payload.icon_emoji = config.iconEmoji;
        }

        payload.text = config.message;

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
                return done();
            }
            return done(body);
        });
    };
};