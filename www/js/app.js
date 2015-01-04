console.log();
angular.module('flux', ['ionic', 'flux.controllers', 'flux.services'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('alarm', {
        url: '/alarm',
        templateUrl: 'templates/alarm.html',
        controller: 'AlarmCtrl'
      });

    $urlRouterProvider.otherwise('/alarm');
  });