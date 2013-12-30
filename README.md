# StarterAWS [![NPM version](https://badge.fury.io/js/starter-aws.png)](http://badge.fury.io/js/starter-aws) [![Build Status](https://travis-ci.org/darul75/starter-aws.png?branch=master)](https://travis-ci.org/darul75/starter-aws) [![Total views](https://sourcegraph.com/api/repos/github.com/darul75/starter-aws/counters/views.png)](https://sourcegraph.com/github.com/darul75/starter-aws)

**StarterAWS** NodeJS module for AWS instances easy management : start/stop/reboot.

## Why ?

Because ecchymose in the nose. 

Tired of checking frenquently my AWS instances status, I will soon combined it with one angular directive to make it available in your administration UI.

But first can be used at your node application startup, and force a clean start of your AWS instances if needed.

A daemon is started and fetch all your zone instances status every minute ( until now time is hard coded )

## Install

~~~
npm install starter-aws
~~~

## Usage

### Command line
```
node starter-aws.js <AWS-accessKeyId> <AWS-secretAccessKey> <AWS-region> <AWS-instancesId> <state>
```

### Application
```javascript
var starterAws = require('starterAws');

// THIS CALL IS MADE BY DEFAULT, options attributes have to be set, with by state start or stop...
starterAws.starter(
  {
    accessKeyId: '', 
    secretAccessKey:'', 
    region: '', 
    instancesId: '',
    state: ''    
  }, 
  function(err, status) {
  // process err
  
  }
);

or

// OTHER CALL here a start
starterAws.start(
  {
    accessKeyId: '', secretAccessKey:'', region: '', instancesId: ''
  }, 
  function(err, status) {}
);

or

// OTHER CALL here a stop
starterAws.stop(
  {
    accessKeyId: '', secretAccessKey:'', region: '', instancesId: ''
  }, 
  function(err, status) {}
);

or

// OTHER CALL here a reboot
starterAws.reboot(
  {
    accessKeyId: '', secretAccessKey:'', region: '', instancesId: ''
  }, 
  function(err, status) {}
);

// OTHER CALL here a to get status
starterAws.status(function(err, status) {

// status my return:
/*[ { InstanceId: 'i-53613f18',
    ImageId: 'ami-c37474b7',
    InstanceType: 't1.micro',
    State: 'stopped' },
  { InstanceId: 'i-98f372d2',
    ImageId: 'ami-3c5f5748',
    InstanceType: 't1.micro',
    State: 'stopped' } ]
  */  
});
```

## Options

* `accessKeyId` AWS accessKeyId
* `secretAccessKey` AWS secretAccessKey
* `region` AWS region
* `instancesId` AWS instance(s) id, ',' separtor if multi, exemple: i-53613f50,i-53613f30,i-53613f20
* `state` string state to force, enum values are 'start', 'stop', 'reboot'
        
## Return    

### status
* `ok` job is done

### err
* `many`  most of time parameters order or missing, easy to figure what is wrong.

## License

The MIT License (MIT)

Copyright (c) 2013 Julien Valéry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
