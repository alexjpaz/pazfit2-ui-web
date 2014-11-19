angular.module('app').config(function($httpProvider, RestangularProvider, AppConfig) {
	$httpProvider.defaults.useXDomain = true;
	RestangularProvider.setBaseUrl(AppConfig.Restangular.baseUrl);

	console.debug(AppConfig.Restangular.baseUrl);

	RestangularProvider.setRestangularFields({
		id: "_id",
		etag: "_etag",
		selfLink: "_links.self.href"
	});

	RestangularProvider.setMethodOverriders = ['PUT','DELETE'];

	RestangularProvider.setDefaultHeaders({
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest'
	});
	RestangularProvider.setDefaultHttpFields({
		//'withCredentials': false
	});

	RestangularProvider.addRequestInterceptor(function(element, operation) {
		var transformedElement = element;


		if(operation === "put") {
			delete transformedElement._id;
			delete transformedElement._links;
			delete transformedElement._updated;
			delete transformedElement._created;
		}


		return transformedElement;
	});


	RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		var extractedData = data;

		if (operation === "getList") {
			// .. and handle the data and meta data
			extractedData = data._items;
			extractedData.meta = data._links;
		} else {
			extractedData = data;
		}
		return extractedData;
	});
});

