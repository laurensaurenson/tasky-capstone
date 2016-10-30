'use strict'

app.controller('TaskDetailCtrl', function ( $scope, $location, $http, $routeParams, $route ) {

  $scope.goToTasks = () => $location.path('/tasks')

  $scope.editTask = taskId => {
    $location.path(`/tasks/edit/${taskId}`)
  }

  $scope.deleteTask = taskId => {
    $http.post(`/api/tasks/delete/${taskId}`)
      .then( task => $location.path('/tasks'))
  }

  $scope.completeTask = taskId => {
    $http.put(`/api/tasks/complete/${taskId}`)
      .then( task => $route.reload())
  }

  $http.get(`/api/tasks/${$routeParams.taskId}`)
    .then( task => $scope.task = task.data)

})