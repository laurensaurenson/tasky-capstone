'use strict'

app.controller('CollectionCtrl', function( $scope, $http, $location ) {
  
  $scope.goToCollectionPage = collectionId => $location.path(`/collections/${collectionId}`)

  $scope.goToNewCollection = () => $location.path('/collections/new')

  $scope.createGroup = () => {
    console.log('yee', $scope.collection)
    $http.post('/api/collections', $scope.collection)
      .then( collection => {
        console.log('collection', collection)
      })
  }

  $http.get('/api/collections')
    .then( collections => {
      $scope.collections = collections.data
    })

})