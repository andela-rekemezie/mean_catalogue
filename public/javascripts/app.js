var libApp = angular.module('libApp',[]);

libApp.controller('mode',function($scope, $http){
  var options = ['Browse Books', 'Add Book'];

  $scope.browseMode = true;
  $scope.options = options;
  $scope.selected = 0;
  $scope.searchForm = {};
  $scope.addForm = {};
  $scope.thumbnails = [];
  $scope.formSet = false;
  $scope.editBook = {};

  $scope.select = function(index){
    $scope.selected = index;
    if(options[index] == options[0]) {
      $scope.browseMode = true;
    } else {
      $scope.browseMode = false;
    }
  };

  $scope.search = function() {
    var urlStr = ($scope.searchForm.all === true)?"/find?query=allf1ae533afea":"/find?query=" + $scope.searchForm.query  ;
    $http({
      method  : 'GET',
      url     : urlStr,
    })
      .success(function(records) {
        $scope.thumbnails = [];
        console.log(records);
        if(records.length == 0) {
          alert("No books in database.");
        }
        for(i in records){
          if($scope.thumbnails.indexOf(records[i]._id) === -1){
            $scope.thumbnails.push(records[i]);
          }
        }
      });
  };

  $scope.delete = function(id) {
    $http({
      method  : 'DELETE',
      url     : "/remove?id=" + id,
    })
      .success(function(data){
        for(var i=0; i<$scope.thumbnails.length; i++) {
          console.log($scope.thumbnails[i]._id +" === "+ data);
          if($scope.thumbnails[i]._id === data){
            alert("Book: " + $scope.thumbnails[i].title + " is deleted." );
            $scope.thumbnails.splice(i,1);
          }
        }
      });
  }

  $scope.insert = function() {
    $http({
      method  : 'POST',
      url     : '/add',
      data    : {data:$scope.addForm},
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    })
      .success(function(data) {
        alert("Book with title: "+ data +" was added.");
      });
      $scope.addForm = {};
  }

  $scope.update = function(id) {
    var index;
    for(i in $scope.thumbnails) {
      console.log($scope.thumbnails[i]._id +" === "+ id);
      if( $scope.thumbnails[i]._id === id) {
        index = i;
      }
    }
    $http({
      method  : 'POST',
      url     : '/update',
      data    : {data:$scope.thumbnails[index]},
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    })
      .success(function(data) {
            $scope.thumbnails[index] = data;
      });
  }

});
