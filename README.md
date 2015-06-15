# edison-i2c-config 

A JavaScript package for configuring I2C bus 6 on the Intel Edison Arduino
base board. After I2C bus 6 has been configured, it can be accessed with the
[i2c-bus](https://github.com/fivdi/i2c-bus) package.

## Installation

    $ npm install edison-i2c-config

## Usage

```js
var i2cConfig = require('edison-i2c-config');

i2cConfig(function (err) {
  if (err) {
    console.log('Sorry, something went wrong configuring I2C bus 6 :(');
  } else {
    console.log('Hey!, I2C bus 6 is ready for usage :)');
    console.log('Run "i2cdetect -y -r 6" to list the devices on bus 6');
  }
});
```

