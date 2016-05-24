	'use strict';
	
	var app = angular.module('app', ['ngRoute']);
	
	var $routeProviderReference;
	var currentRoute;


	// Route Dynamic configration
	app.config(function($routeProvider){
		$routeProviderReference = $routeProvider;
	})
	.run(['$route', '$http', '$rootScope', 'mainFactory', '$routeParams', function($route, $http, $rootScope, mainFactory, $routeParams){
		mainFactory.getTemplates().success(function(temp){
			var loop = 0, currentRoute;
			for(loop = 0; loop < temp.length; loop++){
				currentRoute = temp[loop];
				var routeName = '/' + currentRoute.name;
				$routeProviderReference
					.when('/', {
						templateUrl : 'views/home.html',
						resolve: {
							param : function(){
								return currentRoute.resolve;
							}
						}
					})
					.when(routeName, {
						templateUrl : 'views/' + currentRoute.name + '.html',
						resolve: {
							param : function(){
								return currentRoute.resolve;
							}
						}
					})
					.otherwise({ redirectTo: '/' });
			}
			$route.reload();
		})
	}]);

	// Main horus controller
	app.controller('BodyController', function($scope, $location, mainFactory){
		$scope.pageClass = function(page){
			var activeRoute = $location.path().substring(1) || 'home';
			return page === activeRoute ? 'active' : '';
		}
		function init(){
			mainFactory.getTemplates()
				.success(function(temp){
					$scope.temp = temp;
				});
		}
		init();
	});

	// app factory to pull the information from json
	app.factory('mainFactory', function($http){
		var temp = {};
			temp.getTemplates = function(){
				return $http.get('templates.json');
			};
			return temp;

			mainFactory.$injector = ['$http'];
			angular.module('app').factroy('mainFactory', mainFactory);
	});
