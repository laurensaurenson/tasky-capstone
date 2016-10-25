'use strict'

app.controller('TaskCtrl', function ( $scope, $location, $http ) {

  $scope.goToNewTask = () => {
    $location.path('/tasks/new')
  }

  $http.get('/api/tasks')
    .then( tasks => { 
      $scope.tasks = tasks.data.tasks
    }) 

})