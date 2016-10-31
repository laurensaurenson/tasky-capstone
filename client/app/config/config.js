app.config(function ( $routeProvider ) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: 'partials/home.html'
    })
    // user routing //
    .when('/login', {
      controller: 'LoginCtrl',
      templateUrl: 'partials/user/login.html'
    })
    .when('/register', {
      controller: 'RegisterCtrl',
      templateUrl: 'partials/user/register.html'
    })
    .when('/register/:userId', {
      controller: 'RegisterCtrl', 
      templateUrl: 'partials/user/registerInfo.html'
    })
    .when('/profile', {
      controller: 'ProfileCtrl',
      templateUrl: 'partials/user/profile.html'
    })
    // task routing //
    .when('/tasks', {
      controller: 'TaskCtrl',
      templateUrl: 'partials/tasks/tasks.html'
    })
    .when('/tasks/new', {
      controller: 'NewTaskCtrl', 
      templateUrl: 'partials/tasks/newTask.html'
    })
    .when('/tasks/edit/:taskId', {
      controller: 'TaskEditCtrl',
      templateUrl: 'partials/tasks/editTask.html'
    })
    .when('/tasks/:taskId', {
      controller: 'TaskDetailCtrl',
      templateUrl: 'partials/tasks/taskDetail.html'
    })
    // collection routing //
    .when('/collections', {
      controller: 'CollectionCtrl',
      templateUrl: 'partials/collections.html'    
    })
    .when('/collections/new', {
      controller: 'CollectionCtrl',
      templateUrl: 'partials/collectionNew.html'
    })
    .when('/collections/:collectionId', {
      controller: 'CollectionViewCtrl',
      templateUrl: 'partials/collectionPageView.html'
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