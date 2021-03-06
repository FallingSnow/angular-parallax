'use strict';

angular.module('angular-parallax', [
]).directive('parallax', ['$window', function($window) {
  return {
    restrict: 'A',
    scope: {
      parallaxRatio: '@',
      parallaxVerticalOffset: '@',
      parallaxHorizontalOffset: '@'
    },
    link: function($scope, elem, attrs) {
      var setPosition = function () {
        if(!$scope.parallaxHorizontalOffset) $scope.parallaxHorizontalOffset = '0';
        var calcValY = $window.pageYOffset * ($scope.parallaxRatio ? $scope.parallaxRatio : 1.1 );
        if (calcValY <= $window.innerHeight) {
          var topVal = (calcValY < $scope.parallaxVerticalOffset ? $scope.parallaxVerticalOffset : calcValY);
          var hozVal = ($scope.parallaxHorizontalOffset.indexOf("%") === -1 ? $scope.parallaxHorizontalOffset + 'px' : $scope.parallaxHorizontalOffset);
          elem.css('transform', 'translate(' + hozVal + ', ' + topVal + 'px)');
        }
      };

      setPosition();

      // Handle events
      var bind = function() {
        angular.element($window).bind("scroll", setPosition);
        angular.element($window).bind("touchmove", setPosition);
      };
      var unbind = function() {
        angular.element($window).unbind("scroll", setPosition);
        angular.element($window).unbind("touchmove", setPosition);
      };
      $scope.$on('$destroy', function() {
        unbind();
      });
      attrs.$observe('parallax', function(val) {
        if (val) {
          bind()
        } else {
          unbind();
        }
      })
    }  // link function
  };
}]).directive('parallaxBackground', ['$window', function($window) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {
      parallaxRatio: '@',
      parallaxVerticalOffset: '@',
    },
    link: function($scope, elem, attrs) {
      var setPosition = function () {
          
        var elementCenter = elem.offset().top + elem.outerHeight() / 2;
        var viewCenter = $window.pageYOffset + (window.innerHeight / 2);
        
        var calcValY = 50 * elementCenter / viewCenter * ($scope.parallaxRatio || 1.5); // 50% is the vertical center
        
        
        if (calcValY < 0) calcValY = 0;
        if (calcValY > 100) calcValY = 100;
        elem.css('background-position', "50% " + calcValY + "%");
      };

      // set our initial position - fixes webkit background render bug
      angular.element($window).bind('load', function(e) {
        setPosition();
        $scope.$apply();
      });

      // Handle events
      var bind = function() {
        angular.element($window).bind("scroll", setPosition);
        angular.element($window).bind("touchmove", setPosition);
      };

      // Unbind events on
      var unbind = function() {
        angular.element($window).unbind("scroll", setPosition);
        angular.element($window).unbind("touchmove", setPosition);
      }
      $scope.$on('$destroy', function() {
        unbind();
      });
      attrs.$observe('parallaxBackground', function(val) {
        if (val) {
          bind();
        } else {
          unbind();
        }
      })
    }  // link function
  };
}]);