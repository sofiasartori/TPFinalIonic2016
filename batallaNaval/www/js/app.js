// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic.cloud'])

.run(function($ionicPlatform, $ionicPush) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    console.log('Token saved:', t.token);
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {
  $ionicCloudProvider.init({
        "core": {
          "app_id": "26f96b04"
        },
        "push": {
          "sender_id": "1023680257453",
          "pluginConfig": {
            "android": {
              "iconColor": "#343434"
            }   
          }
        }
  });

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.buscador', {
    url: '/buscador',
    views: {
      'menuContent': {
        templateUrl: 'templates/buscador.html'
      }
    }
  })

  .state('app.jugar', {
      url: '/jugar',
      views: {
        'menuContent': {
          templateUrl: 'templates/jugar.html',
          controller: 'JugarCtrl'
        }
      }
    })
    .state('app.acercaDe', {
      url: '/acercaDe',
      views: {
        'menuContent': {
          templateUrl: 'templates/acercaDe.html'
        }
      }
    })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
