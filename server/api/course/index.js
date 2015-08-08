'use strict';

var express = require('express');
var controller = require('./course.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.post('/orgcourses', controller.orgCourses);
router.get('/me', controller.userCourses);
router.post('/:id/join', controller.join);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/:id/sessions', controller.createSession);
router.post('/:id/sessions/join', controller.joinSession);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;