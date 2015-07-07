angular.module('nodeNumbering', [])

    .controller('mainController', function($scope, $http) {

        $scope.formData = {};
        $scope.numberingData = {};

        // Get all todos
        $http.get('/identifiers')
            .success(function(data) {
                $scope.numberingData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    });

