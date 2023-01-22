
const app = angular.module("carsapp", ['ngRoute', 'firebase', 'toastr']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'fetchcars'
        })
        .when('/add', {
            templateUrl: 'add.html',
            controller: 'addcars'
        })
        .when('/edit/:id', {
            templateUrl: 'edit.html',
            controller: 'editcars'
        })
});

app.controller("fetchcars", function ($scope, $firebaseArray, toastr) {
    let ref = firebase.database().ref("cars");
    $scope.records = $firebaseArray(ref);

    $scope.removeData = function (info) {
        $scope.records.$remove(info)
            .then(function () {
                toastr.error("", "Data " + info.Model + " dihapus!");
                console.info(info);
            }, function (err) {
                console.error(err);
            }
        );
    }
});

app.controller("addcars", function ($scope, $firebaseArray, toastr) {
    let ref = firebase.database().ref("cars");
    $scope.add = function () {
        console.log($scope.cars);
        $firebaseArray(ref).$add($scope.cars).then(function (ref) {
            toastr.success("", "data " + $scope.cars.Model + " berhasil");
            $scope.cars.Id = '';
            $scope.cars.Brand = '';
            $scope.cars.Model = '';
            $scope.cars.Price = '';
        });
    }
});

app.controller("editcars", function ($scope, $firebaseArray, toastr, $firebaseObject, $routeParams) {
    let id = $routeParams.id;
    let ref = firebase.database().ref("cars/" + id);
    $scope.cars = $firebaseObject(ref);

    $scope.edit = function (id) {
        let ref = firebase.database().ref("cars/" + id);
        ref.update({
                Id: $scope.cars.Id,
                Brand: $scope.cars.Brand,
                Model: $scope.cars.Model,
                Price: $scope.cars.Price
            }).then(function(ref){
                console.log($scope.cars);
                toastr.info("", "Data " + $scope.cars.Model + " dirubah!");
            },function(err){
                toastr.error("","Error :(");
                console.error(err);
            });
    }

})