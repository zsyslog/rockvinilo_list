var app = angular.module('app', ['ngRoute'])


app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'IndexController',
      templateUrl:'templates/list.html'
    })
    .when('/detail/:id', {
      controller:'DetailController',
      templateUrl:'templates/detail.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

var Controllers = {

	Index: function($scope, $http, $timeout, $location){
	
		$scope.search = function(keyword) {

			var es = {
				prefix: 'https://www.rockvinilo.com/api/rockvinilo/items/_search?',
				q: [
					'disponibilidad:DISPONIBLE'
				],
				args: [
					'size=1000','sort=artista:asc'
					]
			}

		if (keyword)
			es.q.push(keyword)

		var endpoint = es.prefix + 'q=' + es.q.join(' AND ') + '&' + es.args.join('&')
		console.log(endpoint)

			$http.get(endpoint)
				.success(function(response){
					$scope.items = response.hits.hits;
					$timeout(function(){
						$("img.lazy").lazyload();
					}, 2 * 500);

				})
				.error(function(err){
					console.log(err);
				})
		}

		$scope.filter = function(e) {

			$scope.search($scope.keyword)
			
		}

		$scope.detail = function(id) {
			console.log(id)
			$location.url('/detail/' + id)
		}

		$scope.search();


	},

	Detail: function($scope, $http, $routeParams, $location) {

		console.log($routeParams.id)
		var endpoint = 'https://www.rockvinilo.com/api/rockvinilo/items/' + $routeParams.id;

		$http.get(endpoint)
			.success(function(response){
				$scope.item = response
			})
			.error(function(err){
					console.log(err);
				})

		$scope.back = function() {
			$location.url('/');
		}

	}
}

app.controller('IndexController', Controllers.Index)
app.controller('DetailController', Controllers.Detail)

