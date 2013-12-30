// node AWS module
var AWS = require('aws-sdk');

/* 
 SERVICE COMMAND AWS INSTANCES AWS
*/

function StarterAws() {

  this.options = {};
  this.instancesState = [];
  this.init();
  this.ec2 = new AWS.EC2(this.options);    

  this.starter(this.options, function(err, status){    
    if (err)
      console.log(err);
    else
      console.log(status);
  });

  this.daemon(this.options, function(err, status){    
    if (err)
      console.log(err);
    else
      console.log(status);
  });
}

StarterAws.prototype.init = function() {
  
  var args = process.argv.splice(2);

  if (args.length < 5) {
    process.argv = process.argv.concat(args);
    return;
  }

  args.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });

  // AWS
  this.options.accessKeyId = args[0];
  this.options.secretAccessKey = args[1];
  this.options.region = args[2];
  this.options.instancesId = args[3].split(',');
  this.options.start = args[4];

  process.argv = process.argv.concat(args);

  return this;
};

StarterAws.prototype.starter = function(options, next) {
  
  if (!options.accessKeyId || !options.secretAccessKey || !options.region || !options.instancesId || !options.start)
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId> <state>"));
  
  console.log('----- instances state forced to  : ' + options.start);

  var fn;
  switch(options.start) {    
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

  fn.apply(this.ec2, params(options, next));

  return this;
};

StarterAws.prototype.start = function(options, next) {

  if (!options.accessKeyId || !options.secretAccessKey || !options.region || !options.instancesId)
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId>"));
  
  console.log('----- starting aws instance(s) ');

  this.ec2.startInstances.apply(this.ec2, params(options, next));

  return this;
};

StarterAws.prototype.stop = function(options, next) {

  if (!options.accessKeyId || !options.secretAccessKey || !options.region || !options.instancesId)
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId>"));
  
  console.log('----- stopping aws instance(s) ');

  this.ec2.stopInstances.apply(this.ec2, params(options, next));

  return this;
};

StarterAws.prototype.reboot = function(options, next) {

  if (!options.accessKeyId || !options.secretAccessKey || !options.region || !options.instancesId)
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId>"));
  
  console.log('----- reboot aws instance(s) ');

  this.ec2.rebootInstances.apply(this.ec2, params(options, next));

  return this;
};

StarterAws.prototype.status = function(next) {
  
  console.log('----- status aws instance(s) ');  

  return next(null, this.instancesState);
};


StarterAws.prototype.daemon = function(options, next) {
  
  if (!options.accessKeyId || !options.secretAccessKey || !options.region) {    
    return next(new Error("missing parameters: <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region>"));
  }

  var this_ = this;
  var timeoutId = setInterval(function () {
    console.log('----- getting aws info ');
    this_.ec2.describeInstances({}, function(err, data) {
      if (err) {
        console.log(err);
        clearInterval(timeoutId);
        return next(err);
      }      
      // instanceId : i-53613f18
      var reservations = data.Reservations;
      this_.instancesState = [];

      var i = 0;

      reservations.forEach(function (val, index, array) {
        var reservation = val;
        reservation.Instances.forEach(function (val, index, array) {        
          
          var state = val.State;

          this_.instancesState.push({
            InstanceId: val.InstanceId,
            ImageId: val.ImageId,
            InstanceType: val.InstanceType,
            State : val.State.Name
          });          
        });              
      });

      i++;      

      return next(null, this_.instancesState);
    });
  }, 3000);

  return this;
};

var params = function(options, cb) {
  return [{InstanceIds: options.instancesId}, function(err, data) {
    if (err) {
      console.log(err);
      return cb(err);
    }

    return cb(null, 'ok');
  }];
};

/**
* Export default singleton.
*/
var starterAws = new StarterAws();
module.exports = starterAws;