'use strict';

var _ = require('lodash');
var Course = require('./course.model');
var User = require('../user/user.model');

// Get list of all courses
exports.index = function(req, res) {
  Course.find(function (err, courses) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(courses);
  });
};

// Get list of courses in organization
exports.orgCourses = function(req, res) {
  Course.find({organization: req.body.organization}, function (err, courses) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(courses);
  });
};

// Get list of courses the user is in
exports.userCourses = function(req, res) {
  var userId = req.body.user_id;
  User.findById(userId, function (err, user) {
    Course.find({_id: {$in: user.courses}}, function (err, courses) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(courses);
    });
  });
};

// join a course
exports.join = function(req, res) {
  var userId = req.body.user_id;
  console.log(userId);
  User.findById(userId, function (err, user) {
    console.log(user);
    if(err) { return handleError(res, err); }
    user.courses.push(req.params.id);
    user.save(function(err) {
      if(err) { return handleError(res, err); }
      res.status(200).json(user);
    });
  });
};

// create a study session
exports.createSession = function(req, res) {
  Course.findById(req.params.id, function (err, course) {
    if(err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    course.sessions.push(req.body);
    course.save(function(err) {
      if(err) { return handleError(res, err); }
      res.status(200).json(course);
    });
  });
};

// join a study session
exports.joinSession = function(req, res) {
  Course.findById(req.params.id, function (err, course) {
    if (err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    var session = course.sessions.filter(function(s) {
      return s._id == req.body.session_id;
    });
    var idx = course.sessions.indexOf(session[0]);
    course.sessions[idx].participants.push(req.body.user_id);
    course.save(function(err) {
      if (err) { return handleError(res, err); }
      res.status(200).json(course);
    });
  });
}

// Get a single course
exports.show = function(req, res) {
  Course.findById(req.params.id, function (err, course) {
    if(err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    return res.json(course);
  });
};

// Creates a new course in the DB.
exports.create = function(req, res) {
  Course.create(req.body, function(err, course) {
    User.findById(req.body.user_id, function (err, user) {
      user.courses.push(course._id);
      user.save(function (err) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(course);
      });
    });
  });
};

// Updates an existing course in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Course.findById(req.params.id, function (err, course) {
    if (err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    var updated = _.merge(course, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(course);
    });
  });
};

// Deletes a course from the DB.
exports.destroy = function(req, res) {
  Course.findById(req.params.id, function (err, course) {
    if(err) { return handleError(res, err); }
    if(!course) { return res.status(404).send('Not Found'); }
    course.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}