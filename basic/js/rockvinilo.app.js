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

			$http.get(endpoint)
				.success(function(response){
					$scope.items = response.hits.hits;
					$timeout(function(){
						$("img.lazy").lazyload();
					}, 2 * 500);

				})
				.error(errCallback)
		}

		$scope.filter = function(e) {

			$scope.search($scope.keyword)
			
		}

		$scope.detail = function(id) {
			$location.url('/detail/' + id)
		}

		$scope.search();


	},

	Detail: function($scope, $http, $routeParams, $location) {

		$scope.suggestions = false;

		var endpoint = 'https://www.rockvinilo.com/api/rockvinilo/items/' + $routeParams.id
			, mlt = 'https://www.rockvinilo.com/api/rockvinilo/items/' + $routeParams.id
							+ '/_mlt?mlt_fields=artista,album&min_doc_freq=1&min_term_freq=1'
							+ '&min_word_length=3'
			, starsConfig = {
					readonly: true,
					disabled:true,
					min:1,
					max:10,
					showClear:false,
					size:'xs',
					defaultCaption: 'Carátula'
				}

		$http.get(endpoint)
			.success(function(response){
				$scope.item = response
				$("#cover-grade").rating(starsConfig).rating('update', response._source.estadocaratula);
				starsConfig.defaultCaption = response._source.formato.toLowerCase() == '2xlp' ? 'Discos' : 'Disco';
				$("#disc-grade").rating(starsConfig).rating('update', response._source.estadodisco);

				$http.get(mlt)
					.success(parseMoreLikeThis)
					.error(errCallback)

			})
			.error(errCallback)

		function parseMoreLikeThis(mlt) {
			
			if (mlt.hits.hits.length) {
				console.log(mlt.hits.hits)
				$scope.suggestions = true;
				$scope.mlt = mlt.hits.hits;
			}
			
		}

		$scope.detail = function(id) {
			$location.url('/detail/' + id)
		}

		$scope.back = function() {
			$location.url('/');
		}

	}
}

function errCallback(err) {
	console.log('ERR: ', err);
}

app.controller('IndexController', Controllers.Index)
app.controller('DetailController', Controllers.Detail)

