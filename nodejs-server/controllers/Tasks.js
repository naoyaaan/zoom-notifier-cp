'use strict';

var utils = require('../utils/writer.js');
var Tasks = require('../service/TasksService');

module.exports.create_task = function create_task (req, res, next, body, class_id) {
  Tasks.create_task(body, class_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_tasks = function get_tasks (req, res, next, status) {
  Tasks.get_tasks(status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.put_task = function put_task (req, res, next, body, class_id, task_id) {
  Tasks.put_task(body, class_id, task_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
