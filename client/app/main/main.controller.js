'use strict';

angular.module('piazzahackApp')
  .controller('MainCtrl', function ($scope, Auth, $http, socket, $location) {
    
    $scope.init = function(){
      $scope.courses = [];
      $scope.user = Auth.getCurrentUser();
      $scope.currentCourse={};
      $scope.allUsers = [];
      $scope.users = [];
      $scope.currentSession = {};
      console.log($scope.user);

      $http.get('/api/courses/me', {user_id: $scope.user._id})
        .success(function(data) {
          $scope.courses = data;
          socket.syncUpdates('course', $scope.courses);
        })
        .error(function(data){
          console.log('Error:' +data);
        });
      $http.get('/api/users')
        .success(function(data) {
          $scope.users = data;
          socket.syncUpdates('user', $scope.users);
        })
        .error(function(data){
          console.log('Error:' +data);
        });

      //Check user's org == course's org
    }

    $scope.setCurrentCourse = function(course){
      $scope.currentCourse = course;
    }

    $scope.setCurrentSession = function(session){
      $scope.currestSession = session;
      console.log("currentSession",session);
    }
    
    $scope.getAllUsers = function(){
      $http.get('/api/users')
        .success(function(data){
          $scope.allUsers = data;
          console.log("users", $scope.allUsers);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
    }

    $scope.createCourse = function() {
      if($scope.newCourse !== '') { //check if courses already have that course
        $scope.newCourseData={ name: $scope.newCourse };//organization: $scope.user.orgaization
        $http.post('/api/courses', $scope.newCourseData)
        .success(function(data){
          $scope.newCourseData={};
          console.log("courses", $scope.courses);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
        $scope.newCourse = '';
      }
    };

    $scope.createSession = function(){
      console.log(typeof($scope.c));
      var c = JSON.parse($scope.c);
      $scope.participants = [$scope.user.name];
      $scope.newSessionData={
        date: $scope.date,
        location: $scope.studyLocation,
        message: $scope.sessionName,
        max_number_people: $scope.max_number_people,
        participants: $scope.participants
      }
      // $scope.c.sessions.push(newSessionData);
      $http.post('/api/courses/' + c._id + '/sessions', $scope.newSessionData)
        .success(function(data){
          // console.log("sessions", $scope.c.sessions);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
        $scope.newSessionData= {};
    }

    $scope.updateSession = function(session){
      console.log("ok");
      $scope.updateSessionData={
        date: session.date,
        location: session.studyLocation,
        message: session.sessionName,
        max_number_people: session.max_number_people,
        participants: session.participants,
        comments: session.comments
      }
      console.log(":(", $scope.updateSessionData);
      $http.put('/api/courses/' + $scope.currentCourse._id + '/sessions', $scope.updateSessionData)
        .success(function(data){
          $scope.updateSessionData={};
          console.log("sessions", session);
        })
        .error(function(data){
          console.log('Error: ' + data);
      });
    }

    $scope.addComment = function(session){
      $scope.newComment={
        comment: $scope.commentMessage,
        author: $scope.user.name,
        date: Date.now(), 
        last_modified: null()
      }
      session.comments.push($scope.newComment);
      updateSession(session);
    }

    $scope.editComment = function(session, comment){
      $scope.editComment={
        comment: comment.commentMessage, 
        last_modified: Date.now()
      }
      updateSession(session);
    }

    $scope.addParticipant = function(session){
      // session.participants.push($scope.user.name); //will not work with people with same name...?
      $http.post('/api/courses/' + $scope.currentCourse._id +'/sessions/join', {session_id: session._id, user_name: $scope.user.name})
        .success(function(data){
          console.log("participants", session.participants);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
    }

    $scope.addNote = function(course){
      $scope.newNote={
        date: Date.now(),
        message: $scope.message
      }
      course.notes.push(newNote);
      $http.put('/api/courses/' + course._id +'/notes/', course.notes)
        .success(function(data){
          console.log("notes", course.notes);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
        $scope.newNote= {};
        $scope.message= '';
    }
    
    $scope.deleteNote = function(course, index){
      course.notes.splice(index,1);
      $http.put('/api/courses', course.notes)
        .success(function(data){
          console.log("sessions", course.notes);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
    }

    $scope.deleteParticipant = function(session){
      var index = participants.indexOf($scope.user.name);
      session.participants.splice(index, 1);
    }

    $scope.deleteComment = function(session, index){
      session.comments.splice(index, 1);
      updateSessions(session);
    }

    $scope.deleteSession = function(course, index){
      course.sessions.splice(index,1);
      $http.put('/api/courses', course.sessions)
        .success(function(data){
          console.log("sessions", course.sessions);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
    }

    $scope.deleteCourse = function(course) {
      $http.delete('/api/courses/' + course._id)
      .success(function(data) {
        $scope.todos = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    };
    
    
    // $scope.logOut = function(){
    //   console.log(typeof($scope.c));
      
    //     $scope.user = [];
    //     // Logout, redirect to home
        
    //   }
    
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };
    

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('course');
    });
    $scope.init();
});
