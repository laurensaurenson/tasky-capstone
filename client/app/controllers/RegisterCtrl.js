'use strict'

app.controller('RegisterCtrl', function ( $scope, $http, $location, $routeParams ) {

  const userId = $routeParams.userId

  $scope.register =  () => {
    const newUser = {
      email: $scope.email,
      password: $scope.password
    }

    $http.post('/api/register', newUser)
      .then( ({data}) => {
        console.log("data: ", data)
        $location.path(`/register/${data._id}`)
      })
  }

  $scope.registerInfo = () => {

    console.log("registerInfo")

    const userInfo = {
      userName: $scope.userName,
      description: $scope.description
    }

    $http.put(`/api/register/${userId}`, { profileInfo: userInfo })
      .then(user => $location.path(`/tasks`))

  }

})