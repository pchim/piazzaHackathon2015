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
        $scope.newCourseData={ name: $scope.newCourse };//organization: $scope.user.orgaization
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
      $scope.participants = [$scope.user.name]
      $scope.newSessionData={
        date: $scope.date,
        location: $scope.studyLocation,
        message: $scope.sessionName,
        max_number_people: $scope.max_number_people,
        participants: $scope.participants
      }
      $scope.courses[index].sessions.push(newSessionData);
      $http.put('/api/courses', $scope.courses[index].sessions)
        .success(function(data){
          console.log("sessions", $scope.courses[index].sessions);
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
        $scope.newSessionData= {};
    }

    $scope.updateSession = function(couseIndex, index){
      $scope.updateSessionData={
        date: $scope.date,
        location: $scope.studyLocation,
        message: $scope.sessionName,
        max_number_people: $scope.max_number_people,
        participants: $scope.participants,
        comments: $scope.comments
      }
      $scope.courses[courseIndex].sessions[index] = $scope.updateSessionData;
      $http.put('/api/courses', $scope.courses[courseIndex].sessions[index])
        .success(function(data){
          $scope.updateSessionData={};
          console.log("sessions", $scope.courses[courseIndex].sessions[index]);
        })
        .error(function(data){
          console.log('Error: ' + data);
      });
    }

    $scope.addComment = function(courseIndex, index){
      $scope.newComment={
        comment: $scope.commentMessage,
        author: $scope.user.name,
        date: Date.now()
      }
      $scope.courses[courseIndex].sessions[index].comments.push($scope.newComment);
    }


    $scope.deleteSession = function(courseIndex, index){
      $scope.courses[courseIndex].sessions.splice(index,1);
      $http.put('/api/courses', $scope.courses[index].sessions)
        .success(function(data){
          console.log("sessions", $scope.courses[index].sessions);
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

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('course');
    });
    $scope.init();
});
