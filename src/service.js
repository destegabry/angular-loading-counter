/**
 * @ngdoc service
 * @name dsg.loadingCounter.LoadingCounterProvider
 * 
 * @description
 * 
 * #LoadingCounterProvider 
 * Use `LoadingCounterProvider` to configure the default behaviour of the 
 * {@link dsg.loadingCounter.LoadingCounter LoadingCounter} service.
 */
angular.module('dsg.loadingCounter')
  .provider('LoadingCounter', [function LoadingCounterProvider() {
    'use strict';

    var exclusions = [];

    var shouldExclude = function (config) {
      var shouldBeExcluded = false;
      for (var i = 0; i < exclusions.length && !shouldBeExcluded; i++) {
        var filter = exclusions[i];
        shouldBeExcluded = !!config.method.match(filter.method) && !!config.url.match(filter.url);
      }
      return shouldBeExcluded;
    };

    return {
      /**
       * ngdoc method
       * @name dsg.loadingCounter.LoadingCounterProvider#addExclusion
       * @methodOf dsg.loadingCounter.LoadingCounterProvider
       * 
       * @description 
       * Adds an exclusion pattern to make the {@link dsg.loadingCounter.LoadingCounter LoadingCounter} 
       * service stop counting the specified HTTP requests. 
       * 
       * You must provide an URL pattern; you can also specify the HTTP method to be excluded.
       * 
       * @example
       * AsyncLoader.addExclusion(/^\/api\/?.*$/i, /get|post/i);
       * // excludes all requests starting with /api/ on GET and POST methods
       * 
       * @param {RegExp} url URL pattern to be excluded. Example: /^\/api\/?.*$/i excludes all requests starting with /api/
       * @param {RegExp} [method] HTTP method to be excluded, all methods will be excluded if not defined. Example: /get|post/i excludes all
       */
      addExclusion: function (url, method) {
        if (!url) {
          throw 'You must specify an url pattern for AsyncLoader.addExclusion(url, method); use ".*" if you want to exclude all async calls explicitly';
        }
        exclusions.push({
          url: url,
          method: method || '.*'
        });
      },
      $get: function ($q) {
        /**
         * @ngdoc service
         * @name dsg.loadingCounter.LoadingCounter
         * 
         * @requires $q
         * 
         * @description
         * #LoadingCounter 
         * Service counting the number of async requests and time consuming tasks working in background
         */
        var service = {
          pendingRequestsCount: 0,
          pendingRequests: {}
        };

        /**
         * ngdoc method
         * @name dsg.loadingCounter.LoadingCounter#getPendingRequests
         * @methodOf dsg.loadingCounter.LoadingCounter
         * 
         * @description 
         * Returns the total count of current pending requests.
         * 
         * @return {number} total count of current pending requests
         */
        service.getPendingRequests = function () {
          return pendingRequestsCount;
        };

        /**
         * ngdoc method
         * @name dsg.loadingCounter.LoadingCounter#push
         * @methodOf dsg.loadingCounter.LoadingCounter
         * 
         * @description 
         * Increments the pending requests count making the dsgLoader directive
         * to appear.
         * If an URL is specified, the count of its pending calls will be incremented.
         * This method could be used to programmatically display the dsgLoader directive
         * before a time consuming task.
         * 
         * @example
         * AsyncLoader.push();
         * aTimeConsumingTask.start().then(function() {
         *   AsyncLoader.pop();
         * });
         * 
         * @param  {string} [url] URL of the async call
         */
        service.push = function (url) {
          if (url) {
            service.pendingRequests[url] = (service.pendingRequests[url] || 0) + 1;
          }
          service.pendingRequestsCount++;
        };

        /**
         * ngdoc method
         * @name dsg.loadingCounter.LoadingCounter#pop
         * @methodOf dsg.loadingCounter.LoadingCounter
         * 
         * @description 
         * Decrements the pending requests count making the dsgLoader directive
         * to disappear.
         * If an URL is specified, the count of its pending calls will be decremented.
         * This method could be used to programmatically hide the dsgLoader directive
         * after a time consuming task.
         * 
         * @example
         * AsyncLoader.push();
         * aTimeConsumingTask.start().then(function() {
         *   AsyncLoader.pop();
         * });
         * 
         * @param  {string} [url] URL of the async call
         */
        service.pop = function (url) {
          if (service.pendingRequestsCount > 0) {
            if (url && service.pendingRequests[url] > 0) {
              service.pendingRequests[url]--;
              service.pendingRequestsCount--;
            } else {
              service.pendingRequestsCount--;
            }
          }
        };

        service.request = function (config) {
          if (!shouldExclude(config)) {
            service.push(config.url);
          }
          return config;
        };

        service.requestError = function (rejection) {
          service.pop(rejection.config.url);
          return $q.reject(rejection);
        };

        service.response = function (response) {
          service.pop(response.config.url);
          return response;
        };

        service.responseError = function (rejection) {
          service.pop(rejection.config.url);
          return $q.reject(rejection);
        };

        return service;
      }
    };
  }]);