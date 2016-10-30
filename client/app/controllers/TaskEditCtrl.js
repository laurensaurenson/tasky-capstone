'use strict'

app.controller('TaskEditCtrl', function ( $scope, $location, $http, $routeParams ) {

  $http.get(`/api/tasks/${$routeParams.taskId}`)
    .then( task => $scope.task = task.data)

  $scope.editTask = () => {
    $http.put(`/api/tasks/edit/${$routeParams.taskId}`, $scope.task)
      .then( task => $location.path(`/tasks/${$routeParams.taskId}`))
  }

})