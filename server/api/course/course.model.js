'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourseSchema = new Schema({
  name: String,
  sessions: [{
    date: Date,
    location: String,
    message: String,
    max_number_people: Number,
    participants: [String],
    comments: [{
      comment: String,
      author: String,
      date: Date
    }]
  }],
  notes: [{
    date: Date,
    message: String,
    comments: [{
      comment: String,
      author: String,
      date: Date
    }]
  }]
});

module.exports = mongoose.model('Course', CourseSchema);