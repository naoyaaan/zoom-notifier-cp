'use strict';

var utils = require('../utils/writer.js');
var Classes = require('../service/ClassesService');

module.exports.get_class = function get_class (req, res, next, class_id) {
  Classes.get_class(class_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_classes = function get_classes (req, res, next, since, until) {
  Classes.get_classes(since, until)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
