/**
 * @ngdoc directive
 * @name dsg.loadingCounter.directive:loadingCounter
 * @requires dsg.loadingCounter.LoadingCounter
 * @scope
 * @restrict AEC
 * @element ANY
 * @param {string=} hiddenClass class added to the element when hidden
 * @param {string=} shownClass class added to the element when shown
 * @param {number=} pendingTasksCount binds to the number of pending taks currently in progress
 *
 * @description
 * Directive which hides a DOM element until the LoadingCounter service
 * has a pendingRequestsCount grater than 0.
 *
 * The hiding is performed changing element's CSS property display until you specify
 * `hiddenClass` and/or `shownClass` attributes to the element.
 *
 * You could also use the pendingTasksCount binding to show a countdown or some sort of progress bar.
 */
angular.module('dsg.loadingCounter')
  .directive('loadingCounter', function (LoadingCounter) {
    'use strict';
    return {
      restrict: 'AEC',
      transclude: true,
      scope: {
        pendingTasksCount: '='
      },
      link: function (scope, element, attrs, ctrl, transclude) {
        transclude(scope, function (clone) {
          element.append(clone);
        });

        var toggleVisible = function (show) {
          if (attrs.hiddenClass || attrs.shownClass) {
            if (attrs.hiddenClass) {
              element.toggleClass(attrs.hiddenClass, !show);
            } if (attrs.shownClass) {
              element.toggleClass(attrs.shownClass, show);
            }
          } else if (show) {
            element.show();
          } else {
            element.hide();
          }
        };

        scope.loadingCounter = LoadingCounter;
        scope.pendingTasksCount = LoadingCounter.pendingRequestsCount || 0;


        toggleVisible(false);

        scope.$watch('loadingCounter.pendingRequestsCount', function (newVal, oldVal) {
          if (angular.isDefined(newVal) && angular.isDefined(oldVal) && newVal !== oldVal) {
            toggleVisible(newVal > 0);
            scope.pendingTasksCount = newVal;
          }
        });
      }
    };
  });