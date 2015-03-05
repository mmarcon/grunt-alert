/*request is injected*/

var DEFAULT_CONFIG = {};
DEFAULT_CONFIG.TWILIO_URL = 'https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT}/Messages.json';

module.exports = function(request){
    return function alertSlack(config, grunt, done) {
        var payload = {},
            url = config.endpoint || DEFAULT_CONFIG.TWILIO_URL;

        if(!config.token || !config.account) {
            grunt.log.error('Twilio account id or authorization token not set');
            return done();
        }

        if(!config.from || !config.to) {
            grunt.log.error('Twilio from or to phone numbers not set');
            return done();
        }

        url = url.replace('{ACCOUNT}', config.account);

        payload.Body = config.message;
        payload.From = config.from;
        payload.To = config.to;

        request({
            url: url,
            form: payload,
            method: 'POST',
            auth: {
                user: config.account,
                pass: config.token,
                sendImmediately: true
            }
        }, function(e, r, body){
            if(e) {
                grunt.log.error('Failed to post to Twilio: ' + JSON.stringify(e));
                return done();
            }
            return done(body);
        });
    };
};