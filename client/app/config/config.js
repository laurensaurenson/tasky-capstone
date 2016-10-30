app.config(function ( $routeProvider ) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'partials/home.html'
    })
    // user routing //
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
    .when('/profile', {
      controller: 'ProfileCtrl',
      templateUrl: 'partials/profile.html'
    })
    // task routing //
    .when('/tasks', {
      controller: 'TaskCtrl',
      templateUrl: 'partials/tasks.html'
    })
    .when('/tasks/new', {
      controller: 'NewTaskCtrl', 
      templateUrl: 'partials/newTask.html'
    })
    .when('/tasks/edit/:taskId', {
      controller: 'TaskEditCtrl',
      templateUrl: 'partials/editTask.html'
    })
    .when('/tasks/:taskId', {
      controller: 'TaskDetailCtrl',
      templateUrl: 'partials/taskDetail.html'
    })
    // friend routing //
    .when('/friends', {
      controller: 'FriendCtrl',
      templateUrl: 'partials/friends.html'
    })
    .when('/friends/add', {
      controller: 'FriendCtrl',
      templateUrl: 'partials/addFriend.html'
    })
    // group routing //
    .when('/groups', {
      controller: 'GroupCtrl',
      templateUrl: 'partials/groups/groupView.html'
    })
    .when('/groups/new', {
      controller: 'GroupCtrl',
      templateUrl: 'partials/groups/groupNew.html'
    })
    .when('/groups/:groupId', {
      controller: 'GroupViewCtrl',
      templateUrl: 'partials/groups/groupPage.html'
    })
    .when('/groups/edit/:groupId', {
      controller: 'GroupEditCtrl',
      templateUrl: 'partials/groups/groupEdit.html'
    })
    .when('/logout', {
      controller: 'LoginCtrl',
      templateUrl: 'partials/logout.html'
    })
})