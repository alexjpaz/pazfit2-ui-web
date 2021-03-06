angular.module('app').directive('promiseShow', function($q) {
	return {
		require: '^?promise',
		link: function(scope, element, attrs, promiseCtrl) {
			var mode = 'busy';
			var fns = {
				show: function() {
					attrs.$removeClass('ng-hide');
				},
				hide: function() {
					attrs.$addClass('ng-hide');
				}
			};

			attrs.$observe('promiseShow', function(arg) {
				mode = arg;
			});

			fns.hide();

			promiseCtrl.registerPromiseListener(function(promise) {
				if(mode === 'busy') {
					fns.show();
					promise['finally'](fns.hide);
				} else {
					fns.hide();
					if(mode === 'resolved') {
						promise.then(fns.show);
					}

					if(mode === 'rejected') {
						promise['catch'](fns.show);
					}
				}
			});
		}
	}
});
