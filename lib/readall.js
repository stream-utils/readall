/**!
 * readall - lib/readall.js
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

var debug = require('debug')('readall');

function readall(stream, callback) {
  var chunks = [];
  var size = 0;

  function clean() {
    stream.removeListener('readable', onread);
    stream.removeListener('error', onerror);
    stream.removeListener('end', onend);
  }

  function onread() {
    var chunk;
    while (chunk = stream.read()) {
      size += chunk.length;
      chunks.push(chunk);
      debug('read #%d %d/%d bytes', chunks.length, chunk.length, size);
    }
  }

  function onerror(err) {
    clean();
    debug('read error: %s', err.message);
    callback(err);
  }

  function onend() {
    clean();
    var data = null;
    if (size > 0) {
      data = Buffer.concat(chunks, size);
    }
    debug('read end, %d chunks, %d bytes', chunks.length, size);
    callback(null, data);
  }

  stream.on('readable', onread);
  stream.on('end', onend);
  stream.on('error', onerror);

  onread();
}

module.exports = readall;
