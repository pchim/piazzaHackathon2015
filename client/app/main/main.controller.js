'use strict';

angular.module('piazzahackApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    
    $scope.init = function(){
      $scope.courses = [];
      $scope.user = [];
      $scope.currentCourse='';

      $http.get('/api/courses')
        .success(function(data) {
          $scope.courses = data;
          socket.syncUpdates('course', $scope.courses);
        })
        .error(function(data){
          console.log('Error:' +data);
        });
      // $http.get('/api/users')
      //   .success(function(data) {
      //     $scope.users = data;
      //     socket.syncUpdates('user', $scope.users);
      //   })
      //   .error(function(data){
      //     console.log('Error:' +data);
      //   });
      //Check user's org == course's org
    }

    $scope.createCourse = function() {
      if($scope.newCourse !== '') { //check if courses already have that course
        $scope.newCourseData={ name: $scope.newCourse}; //organization: $scope.user.orgaization
        $http.post('/api/courses', $scope.newCourseData)
        .success(function(data){
          $scope.newCourseData={};
          $scope.courses.push(data);
          console.log("courses", $scope.courses);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
        $scope.newCourse = '';
      }
    };

    $scope.createSession = function(index){
      $scope.newSessionData={
        date: $scope.date,
        location: $scope.studyLocation,
        message: $scope.sessionName,
        max_number_people: $scope.max_number_people,
        participants: [$scope.user.name]
      }
      $http.post('/api/courses', $scope.newSessionData)
        .success(function(data){
          $scope.newSessionData={};
          $scope.courses[index].sessions.push(data);
          console.log("sessions", $scope.courses[index].sessions);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
        $scope.newSession= '';
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

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('course');
    });
    $scope.init();
});
