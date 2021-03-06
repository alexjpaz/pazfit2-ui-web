angular.module('app').directive('promise', function($q) {
	return {
		controller: function($scope, $element, $attrs) {
			var promiseListeners = [];

			var currentPromise = null;

			$attrs.$addClass('promise');

			$scope.$watch($attrs.promise, function(promise) {	
				var when = $q.when(promise);

				currentPromise = when;

				$scope.promise = currentPromise;

				angular.forEach(promiseListeners, function(pl, ii) {
					if(angular.isFunction(pl)) {
						pl(currentPromise);
					}
				});

				$attrs.$addClass('promise--busy');

				when.then(function($object) {
					$attrs.$addClass('promise--resolved');
					$attrs.$removeClass('promise--busy');

					console.debug(arguments);

					when.$object = $object;
				});

				when['catch'](function($object) {
					$attrs.$addClass('promise--rejected');
					$attrs.$removeClass('promise--busy');
					angular.forEach(promiseListeners.catchFns, function(pl, ii) {
						if(angular.isDefined(pl)) {
							pl();
						} else {
							//promiseListeners.catchFns.splice(ii, 1);
						}
					});

					when.$object = $object;
					when.$error = $object;
				});
			});

			this.registerPromiseListener = function(cbFn) {
				promiseListeners.push(cbFn);
			};
		}
	}
});
