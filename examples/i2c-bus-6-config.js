"use strict";

var i2cConfig = require('../');

i2cConfig(function (err) {
  if (err) {
    console.log('Sorry, something went wrong configuring I2C bus 6 :(');
  } else {
    console.log('Hey!, I2C bus 6 is ready for usage :)');
    console.log('Run "i2cdetect -y -r 6" to list the devices on bus 6');
  }
});

