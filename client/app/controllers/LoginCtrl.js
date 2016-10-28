app.controller('LoginCtrl', function ( $scope, $http, $rootScope ) {

  $scope.login =  () => {
    console.log("login");

    const user = {
      email: $scope.email,
      password: $scope.password
    }

    $http.post('/api/login', user)
      .then( ({data}) => {
        $rootScope.user = data
        console.log('root user: ', $rootScope.user)
      })
  }

  $scope.logout = () => {
    $http.post('/api/logout')
    console.log('logout')
  }

})