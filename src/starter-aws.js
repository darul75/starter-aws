// node AWS module
var AWS = require('aws-sdk');

/* 
 SERVICE COMMAND AWS INSTANCES AWS
*/

function StarterAws() {

  this.options = { 
    debug: true 
  };
  this.instancesState = [];
  this.init();
  this.ec2 = new AWS.EC2(this.options);  

  var this_ = this;  

  // FIRST CALL UPDATE STATE
  this.starter(function(err, status){    
    if (err) console.log(err);
    else {
      if (this_.options.debug)
        console.log(status);
    }
  });

  // SMALL DAEMON CHECK STATUS
  this.daemon(function(err, status){    
    if (err) console.log(err);
    else {
      if (this_.options.debug)
        console.log(status);
    }
  });
}

// INIT FOR COMMAND LINE ARGS
StarterAws.prototype.init = function() {
  
  var args = process.argv.splice(2);

  if (args.length < 5) { process.argv = process.argv.concat(args); return; }

  args.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });

  // AWS
  this.options.accessKeyId = args[0];
  this.options.secretAccessKey = args[1];
  this.options.region = args[2];
  this.options.instancesId = args[3];
  this.options.state = args[4];

  process.argv = process.argv.concat(args);

  return this;
};

// INIT FOR APPLICATION WITH CREDENTIALS
StarterAws.prototype.initCredentials = function(options) {
  
  if (!options.accessKeyId || !options.secretAccessKey || !options.region || !options.instancesId)
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId>"));

  // override defaults with passed in options
    f.extend(this.options, options);   
  this.ec2 = new AWS.EC2(this.options);

  return this;
};

StarterAws.prototype.starter = function(next) {

  console.log('----- call starter  ----- ');
  
  if (!this.options.accessKeyId || !this.options.secretAccessKey || !this.options.region || !this.options.instancesId || !this.options.state)
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId> <state>"));
  
  console.log('----- instances state forced to  : ' + this.options.state);

  var fn;
  switch(this.options.state) {    
    case 'stop':
      fn = this.ec2.stopInstances;
    break;
    case 'reboot':
      fn = this.ec2.rebootInstances;
    break;
    default:
      fn = this.ec2.startInstances;
    break;
  }  

  fn.apply(this.ec2, paramsFunctions(this.options, next));

  return this;
};

StarterAws.prototype.start = function(next) { this.options.state = 'start'; this.starter(next); return this; };

StarterAws.prototype.stop = function(next) { this.options.state = 'stop'; this.starter(next); return this; };

StarterAws.prototype.reboot = function(next) { this.options.state = 'reboot'; this.starter(next); return this; };

StarterAws.prototype.status = function(next) {
  
  console.log('----- status aws instance(s) ');

  return next(null, this.instancesState);
};

StarterAws.prototype.daemon = function(next) {
  
  console.log('----- starting daemon');

  if (!this.options.accessKeyId || !this.options.secretAccessKey || !this.options.region) {
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region>"));
  }

  var this_ = this;
  var timeoutId = setInterval(function () {
    console.log('----- getting aws info ');
    this_.ec2.describeInstances({}, function(err, data) {
      if (err) {
        console.log('--- daemon stopped because of :' + err);
        clearInterval(timeoutId);
        return next(err);
      }      
      // instanceId : i-53613f18
      var reservations = data.Reservations;
      this_.instancesState = [];

      reservations.forEach(function (val, index, array) {
        var reservation = val;
        reservation.Instances.forEach(function (val, index, array) {        

          this_.instancesState.push({
            InstanceId: val.InstanceId,
            ImageId: val.ImageId,
            InstanceType: val.InstanceType,
            State : val.State.Name
          });          
        });              
      });

      return next(null, this_.instancesState);
    });
  }, 60000);

  return this;
};

var paramsFunctions = function(options, cb) {    
  return [{InstanceIds:options.instancesId.split(',')}, function(err, data) {
    if (err) {
      console.log(err.toString());
      return cb(err.toString());
    }
    
    return cb(null, 'ok');
  }];
};

// overriding for the functions
var f = {

    extend: function(target, source) {
        if (!source || typeof source === 'function') {
            return target;
        }
        
        for (var attr in source) { target[attr] = source[attr]; }
            return target;
    }
};

/**
* Export default singleton.
*/
var starterAws = new StarterAws();
module.exports = starterAws;