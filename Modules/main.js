var app = angular.module("computerScienceIA", ["ngRoute", 'ui.materialize']);

app.config(function($routeProvider) { // Making the Router Provider
            $routeProvider
                .when("/", {
                    templateUrl: "/Modules/Login/login.html", // Template Url  
                    controller: "loginController" // Linked Controller
                });
});

app.controller('baseController',function($scope,$route){
    
});