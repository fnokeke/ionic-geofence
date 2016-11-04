// Geo Places App

angular.module("ionic-geofence", ["ionic", "ngCordova"]).run(function($window, $document, $ionicLoading, $state,
  $ionicPlatform, $cordovaLocalNotification, $log, $rootScope, GeofencePluginMock, LogData, GeoService) {

  $ionicPlatform.ready(function() {

    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if ($window.StatusBar) {
      $window.StatusBar.styleDefault();
    }

    if ($window.google === undefined) {
      $log.warn("Google Places plugin not found.");
    } else {
      $log.log("Google Places plugin successfully loaded");
    }

    if ($window.geofence === undefined) {
      $log.warn("Geofence Plugin not found. Using mock instead.");
      $window.geofence = GeofencePluginMock;
      $window.TransitionType = GeofencePluginMock.TransitionType;
    }

    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }


    function notify(title, text) {
      var now = new Date().getTime();
      var no_of_secondes = 5;
      var secs_from_now = new Date(now + (1000 * no_of_secondes));

      var counter = localStorage.counter ? parseInt(localStorage.counter) % 20 : 0;
      localStorage.counter = ++counter;

      $cordovaLocalNotification.schedule({
        title: title,
        text: text,
        at: secs_from_now,
        id: counter
      });
    }

    $window.geofence.onTransitionReceived = function(geofences) {
      $log.log('transtn detected:', geofences);

      var dd = new Date();
      dd.setTime(dd.getTime() - 240 * 60 * 60); // NYC timezone
      dd = ' (' + dd.toLocaleString() + ')';

      if (geofences) {
        $rootScope.$apply(function() {
          geofences.forEach(function(arg) {
            console.log('root arg: ', arg);

            var geo = GeoService.findById(arg.id);
            console.log('findById arg: ', geo);
            var action = arg.transitionType === 1 ? 'enter' : 'exit';
            notify(geo.title, action + ' ' + geo.text);

            var dd = new Date();
            dd.setTime(dd.getTime() - 240 * 60 * 60); // NYC timezone
            dd = ' (' + dd.toLocaleString() + ')';
            LogData.save(action + ' ' + geo.text.substr(0, 10) + ' ' + dd);

          });
        });
      }
    };

    $window.geofence.onNotificationClicked = function(geofence) {
      $log.log('notificationData in app.js:', geofence);

      var dd = new Date();
      dd.setTime(dd.getTime() - 240 * 60 * 60); // NYC timezone
      dd = ' (' + dd.toLocaleString() + ')';

      if (geofence) {
        $rootScope.$apply(function() {
          $ionicLoading.show({
            template: "Notification clicked: " + geofence.text,
            noBackdrop: true,
            duration: 2000
          });

          $state.go("geofence", {
            geofenceId: geofence.id
          });
        });
      }
    };

    $window.geofence.initialize(function() {
      $log.log("Geofence plugin initialized");
    });

  });


  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    $log.log("stateChangeError ", error, toState, toParams, fromState, fromParams);
    $state.go("geofences");
  });
});
