var fs = require('fs');
 
var config = function() {
    // constructor
};
 
config.prototype.init = function(file, cb) {
    fs.readFile(file, function (err, data) {
        if (err) {
            console.log(err);
            cb(-1);
        } else {
            var json = JSON.parse(data);
            for (var o in json)
                config.prototype[o] = json[o];            
            cb(0); // no error
        }
    });
};
 
module.exports = new config();