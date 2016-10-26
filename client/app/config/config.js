app.config(function ( $routeProvider ) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'partials/home.html'
    })
    .when('/login', {
      controller: 'LoginCtrl',
      templateUrl: 'partials/login.html'
    })
    .when('/register', {
      controller: 'RegisterCtrl',
      templateUrl: 'partials/register.html'
    })
    .when('/register/:userId', {
      controller: 'RegisterCtrl', 
      templateUrl: 'partials/registerInfo.html'
    })
    .when('/tasks', {
      controller: 'TaskCtrl',
      templateUrl: 'partials/tasks.html'
    })
    .when('/tasks/new', {
      controller: 'NewTaskCtrl', 
      templateUrl: 'partials/newTask.html'
    })
    .when('/friends', {
      controller: 'FriendCtrl',
      templateUrl: 'partials/friends.html'
    })
    .when('/friends/add', {
      controller: 'FriendCtrl',
      templateUrl: 'partials/addFriend.html'
    })
})