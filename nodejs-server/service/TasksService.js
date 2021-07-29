'use strict';


/**
 * 新規タスクを作成する
 *
 * body Task 新規タスクを作成する
 * class_id Integer 
 * returns inline_response_200_1
 **/
exports.create_task = function(body,class_id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "code" : 200,
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * タスク一覧を取得する
 *
 * status String 
 * returns List
 **/
exports.get_tasks = function(status) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 既存タスクを編集する
 *
 * body Task 既存タスクを編集する
 * class_id Integer 
 * task_id Integer 
 * returns inline_response_200_1
 **/
exports.put_task = function(body,class_id,task_id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "code" : 200,
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

