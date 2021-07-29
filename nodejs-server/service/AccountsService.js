'use strict';


/**
 * アカウント情報を取得する
 *
 * returns User
 **/
exports.get_account_info = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "rss_url" : "rss_url",
  "id" : 0,
  "ical_url" : "ical_url",
  "username" : "username"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 既存のアカウントにサインインする
 *
 * body Credential ユーザ名とパスワードを渡すことでサインインする
 * returns inline_response_200
 **/
exports.signin = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "token" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywibmFtZSI6ImFkbWluIiwiY3JlYXRlZF9hdCI6IjIwMjAtMTEtMzAgMjA6MjA6MjcuNjgwMzc4In0.SFahA-KiN0pU1K7U_LJb1DR4wDeRZnqN60fxNrWchQ4"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 新規アカウントを作成する
 *
 * body Credential ユーザ名とパスワードを渡すことで新規登録する
 * returns inline_response_200_1
 **/
exports.signup = function(body) {
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
 * アカウント情報を更新する
 *
 * body Settings パスワードとOCW-iのRSS/iCalのURLを渡しアカウント情報を更新する
 * returns inline_response_200_1
 **/
exports.update_account_info = function(body) {
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

