var fs = require('fs'),
    path = require('path');

function FileLogger(logfile) {
    this.file = path.resolve(process.cwd(), logfile);
}

FileLogger.prototype.log = function(message) {
    var date = new Date();
    message = 'LOG   - ' + date.toISOString() + ' - ' + message + '\n';
    fs.appendFileSync(this.file, message);
};

FileLogger.prototype.error = function(message) {
    var date = new Date();
    message = 'ERROR - ' + date.toISOString() + ' - ' + message + '\n';
    fs.appendFileSync(this.file, message);
};

function NoopLogger(){}

NoopLogger.prototype.log = function(){};
NoopLogger.prototype.error = function(){};

module.exports = function(logfile) {
    if(logfile) {
        return new FileLogger(logfile);
    }
    return new NoopLogger();
};