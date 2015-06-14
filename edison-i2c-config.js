"use strict";

var fs = require('fs');

var GPIO_SYS_PATH = '/sys/class/gpio/',
  GPIO_DEBUG_PATH = '/sys/kernel/debug/gpio_debug/',
  GPIO_EXPORT_FILE = GPIO_SYS_PATH + 'export';

var DELAY = 50;

var exportGpio = function(task, cb) {
  var gpioPath = GPIO_SYS_PATH + 'gpio' + task.gpio;

  // if the directory for the gpio already exist, do nothing
  if (fs.existsSync(gpioPath)) {
    return setImmediate(cb);
  }

  fs.writeFile(GPIO_EXPORT_FILE, task.gpio, cb);
};

var direction = function(task, cb) {
  var directionFile = GPIO_SYS_PATH + 'gpio' + task.gpio + '/direction';

  fs.writeFile(directionFile, task.direction, cb);
};

var currentPinmux = function (task, cb) {
  var currentPinmuxFile = GPIO_DEBUG_PATH + 'gpio' + task.gpio + '/current_pinmux';

  fs.writeFile(currentPinmuxFile, task.pinmux, cb);
};

var performTasks = function (tasks, cb) {
  var task = tasks.shift();

  if (!task) {
    return setImmediate(cb);
  }

  task.func(task, function (err) {
    if (err) {
      return cb(err);
    }
    setTimeout(function () {
      performTasks(tasks, cb);
    }, DELAY);
  });
};

module.exports = function(cb) {
  var tasks = [
    {func: exportGpio, gpio: 28},
    {func: exportGpio, gpio: 27},
    {func: exportGpio, gpio: 204},
    {func: exportGpio, gpio: 205},
    {func: exportGpio, gpio: 236},
    {func: exportGpio, gpio: 237},
    {func: exportGpio, gpio: 14},
    {func: exportGpio, gpio: 165},
    {func: exportGpio, gpio: 212},
    {func: exportGpio, gpio: 213},
    {func: exportGpio, gpio: 214},
    {func: direction, gpio: 214, direction: 'low'},
    {func: direction, gpio: 204, direction: 'low'},
    {func: direction, gpio: 205, direction: 'low'},
    {func: direction, gpio: 14, direction: 'in'},
    {func: direction, gpio: 165, direction: 'in'},
    {func: direction, gpio: 236, direction: 'low'},
    {func: direction, gpio: 237, direction: 'low'},
    {func: direction, gpio: 212, direction: 'in'},
    {func: direction, gpio: 213, direction: 'in'},
    {func: currentPinmux, gpio: 28, pinmux: 'mode1'},
    {func: currentPinmux, gpio: 27, pinmux: 'mode1'},
    {func: direction, gpio: 214, direction: 'high'}
  ];

  performTasks(tasks, cb);
};

