/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Course = require('./course.model');

exports.register = function(socket) {
  Course.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Course.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('course:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('course:remove', doc);
}