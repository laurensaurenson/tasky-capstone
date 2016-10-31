'use strict'

app.controller('RegisterCtrl', function ( $scope, $http, $location, $routeParams ) {

  $scope.register =  () => {
    $http.post('/api/register', $scope.newUser)
      .then( ({data}) => $location.path(`/register/${data._id}`))
  }

  $scope.registerInfo = () => {
    $http.put(`/api/register/${$routeParams.userId}`, { profileInfo: $scope.userInfo })
      .then(user => $location.path(`/login`))
  }

})