"use strict";

var fs = require('fs');

var GPIO_SYS_PATH = '/sys/class/gpio/',
  GPIO_DEBUG_PATH = '/sys/kernel/debug/gpio_debug/',
  GPIO_EXPORT_FILE = GPIO_SYS_PATH + 'export';

var DELAY = 50;

var exportGpio = function(gpio, cb) {
  var gpioPath = GPIO_SYS_PATH + 'gpio' + gpio;

  // if the directory for the gpio already exist, do nothing
  if (fs.existsSync(gpioPath)) {
    return setImmediate(cb);
  }

  fs.writeFile(GPIO_EXPORT_FILE, gpio, cb);
};

var direction = function(gpio, direction, cb) {
  var directionFile = GPIO_SYS_PATH + 'gpio' + gpio + '/direction';

  fs.writeFile(directionFile, direction, cb);
};

var currentPinmux = function (gpio, pinmux, cb) {
  var currentPinmuxFile = GPIO_DEBUG_PATH + 'gpio' + gpio + '/current_pinmux';

  fs.writeFile(currentPinmuxFile, pinmux, cb);
};

var performTasks = function (tasks, cb) {
  var task = tasks.shift();

  if (!task) {
    return setImmediate(cb);
  }

  task.func.apply(null, task.args.concat(function (err) {
    if (err) {
      return cb(err);
    }
    setTimeout(function () {
      performTasks(tasks, cb);
    }, DELAY);
  }));
};

module.exports = function(cb) {
  var tasks = [
    {func: exportGpio, args: [28]},
    {func: exportGpio, args: [27]},
    {func: exportGpio, args: [204]},
    {func: exportGpio, args: [205]},
    {func: exportGpio, args: [236]},
    {func: exportGpio, args: [237]},
    {func: exportGpio, args: [14]},
    {func: exportGpio, args: [165]},
    {func: exportGpio, args: [212]},
    {func: exportGpio, args: [213]},
    {func: exportGpio, args: [214]},
    {func: direction, args: [214, 'low']},
    {func: direction, args: [204, 'low']},
    {func: direction, args: [205, 'low']},
    {func: direction, args: [14, 'in']},
    {func: direction, args: [165, 'in']},
    {func: direction, args: [236, 'low']},
    {func: direction, args: [237, 'low']},
    {func: direction, args: [212, 'in']},
    {func: direction, args: [213, 'in']},
    {func: currentPinmux, args: [28, 'mode1']},
    {func: currentPinmux, args: [27, 'mode1']},
    {func: direction, args: [214, 'high']}
  ];

  performTasks(tasks, cb);
};

