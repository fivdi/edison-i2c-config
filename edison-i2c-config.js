"use strict";

var fs = require('fs');

var GPIO_SYS_PATH = '/sys/class/gpio/',
  GPIO_DEBUG_PATH = '/sys/kernel/debug/gpio_debug/',
  GPIO_EXPORT_FILE = GPIO_SYS_PATH + 'export';

var EXPORT = 'export',
  DIRECTION = 'direction',
  PINMUX = 'pinmux';

var DELAY = 50;

var exportGpio = function(gpio, cb) {
  var gpioPath = GPIO_SYS_PATH + 'gpio' + gpio;

  // if the directory for the gpio already exist, do nothing
  if (fs.existsSync(gpioPath)) {
    return setImmediate(cb);
  }

  fs.writeFile(GPIO_EXPORT_FILE, gpio, cb);
};

var gpioDirection = function(gpio, direction, cb) {
  var gpioDirectionFile = GPIO_SYS_PATH + 'gpio' + gpio + '/direction';

  fs.writeFile(gpioDirectionFile, direction, cb);
};

var gpioCurrentPinmux = function (gpio, pinmux, cb) {
  var gpioCurrentPinmuxFile = GPIO_DEBUG_PATH + 'gpio' + gpio + '/current_pinmux';

  fs.writeFile(gpioCurrentPinmuxFile, pinmux, cb);
};

var performTasks = function (tasks, cb) {
  setTimeout(function () {
    var task = tasks.shift();

    var nextTask = function (err) {
      if (err) {
        return cb(err);
      }
      performTasks(tasks, cb);
    }

    if (!task) {
      return cb(null);
    }

    if (task.name === EXPORT) {
      exportGpio(task.gpio, nextTask);
    } else if (task.name === DIRECTION) {
      gpioDirection(task.gpio, task.direction, nextTask);
    } else if (task.name === PINMUX) {
      gpioCurrentPinmux(task.gpio, task.pinmux, nextTask);
    }
  }, DELAY);
};

module.exports = function(cb) {
  var tasks = [
    {name: EXPORT, gpio: 28},
    {name: EXPORT, gpio: 27},
    {name: EXPORT, gpio: 204},
    {name: EXPORT, gpio: 205},
    {name: EXPORT, gpio: 236},
    {name: EXPORT, gpio: 237},
    {name: EXPORT, gpio: 14},
    {name: EXPORT, gpio: 165},
    {name: EXPORT, gpio: 212},
    {name: EXPORT, gpio: 213},
    {name: EXPORT, gpio: 214},
    {name: DIRECTION, gpio: 214, direction: 'low'},
    {name: DIRECTION, gpio: 204, direction: 'low'},
    {name: DIRECTION, gpio: 205, direction: 'low'},
    {name: DIRECTION, gpio: 14, direction: 'in'},
    {name: DIRECTION, gpio: 165, direction: 'in'},
    {name: DIRECTION, gpio: 236, direction: 'low'},
    {name: DIRECTION, gpio: 237, direction: 'low'},
    {name: DIRECTION, gpio: 212, direction: 'in'},
    {name: DIRECTION, gpio: 213, direction: 'in'},
    {name: PINMUX, gpio: 28, pinmux: 'mode1'},
    {name: PINMUX, gpio: 27, pinmux: 'mode1'},
    {name: DIRECTION, gpio: 214, direction: 'high'},
  ];

  performTasks(tasks, cb);
};

