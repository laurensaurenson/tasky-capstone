'use strict'

app.controller('CollectionViewCtrl', function ( $scope, $http, $location, $routeParams ) {

  // $scope.deleteCollection = () => {
  //   $http.post('/api/collections/delete')
  //     .then( collection => {
  //       console.log('collection deleted', collection)
  //     })
  // }

  $scope.backToCollections = () => $location.path('/collections')

  $http.get(`/api/collections/${$routeParams.collectionId}`)
    .then( collection => {
      $scope.collection = collection.data.group
      $scope.tasks = collection.data.tasks
    })

})