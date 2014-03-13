/**!
 * readall - test/readall.test.js
 *
 * Copyright(c) 2014 fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');
var http = require('http');
var EventEmitter = require('events').EventEmitter;
var should = require('should');
var readall = require('../');

describe('readall.test.js', function () {
  it('should read file stream success', function (done) {
    readall(fs.createReadStream(__filename), function (err, data) {
      should.not.exist(err);
      data.should.be.a.Buffer;
      data.should.length(fs.statSync(__filename).size);
      done();
    });
  });

  it('should pipe file stream success', function (done) {
    readall(fs.createReadStream(__filename), fs.createWriteStream(__filename + '.out'),
    function (err, data) {
      should.not.exist(err);
      should.not.exist(data);
      fs.statSync(__filename + '.out').size.should.equal(fs.statSync(__filename).size);
      done();
    });
  });

  it('should read not file stream error', function (done) {
    readall(fs.createReadStream(__filename + 'notexist'), function (err, data) {
      should.exist(err);
      err.message.should.include('ENOENT');
      should.not.exist(data);
      done();
    });
  });

  it('should read http response stream success', function (done) {
    http.get('http://r.cnpmjs.org/byte', function (res) {
      readall(res, function (err, data) {
        should.not.exist(err);
        data.should.be.a.Buffer;
        done();
      });
    });
  });

  it('should read http response stream fail when req.abort()', function (done) {
    var req = http.get('http://r.cnpmjs.org/npm', function (res) {
      setTimeout(function () {
        req.abort();
      }, 1);
      var aborted = false;
      res.on('aborted', function () {
        // console.log('req aborted');
        aborted = true;
      });
      readall(res, function (err, data) {
        should.not.exist(err);
        data.should.be.a.Buffer;
        aborted.should.equal(true);
        done();
      });
    });
  });

  it('should mock stream error', function (done) {
    var stream = new EventEmitter();
    stream.read = function () {
      return null;
    };

    readall(stream, function (err, data) {
      should.exist(err);
      err.message.should.equal('mock error');
      should.not.exist(data);
      done();
    });

    stream.emit('error', new Error('mock error'));
    stream.emit('end');
  });

  it('should mock stream empty', function (done) {
    var stream = new EventEmitter();
    stream.read = function () {
      stream.read = function () {};
      return new Buffer('');
    };

    readall(stream, function (err, data) {
      should.not.exist(err);
      should.not.exist(data);
      done();
    });

    stream.emit('end');
  });
});
