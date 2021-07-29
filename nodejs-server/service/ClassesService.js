'use strict';


/**
 * クラス詳細を取得する
 *
 * class_id Integer 
 * returns Class
 **/
exports.get_class = function(class_id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * クラス一覧を取得する
 *
 * since date  (optional)
 * until date  (optional)
 * returns List
 **/
exports.get_classes = function(since,until) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "name" : "name",
  "next_class" : {
    "starts_at" : "2000-01-23T04:56:07.000+00:00",
    "location" : "location",
    "ends_at" : "2000-01-23T04:56:07.000+00:00"
  }
}, {
  "name" : "name",
  "next_class" : {
    "starts_at" : "2000-01-23T04:56:07.000+00:00",
    "location" : "location",
    "ends_at" : "2000-01-23T04:56:07.000+00:00"
  }
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

