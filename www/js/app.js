// Geo Places App

angular.module("ionic-geofence", ["ionic"]).run(function($window, $document, $ionicLoading, $state,
  $ionicPlatform, $log, $rootScope, GeofencePluginMock) {

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

    if (window.Connection === undefined) {
      $log.warn("Your ionic app has no internet connection");
    } else {
      $log.log("Your app internet status: ", navigator.connection.type);
    }

    if ($window.geofence === undefined) {
      $log.warn("Geofence Plugin not found. Using mock instead.");
      $window.geofence = GeofencePluginMock;
      $window.TransitionType = GeofencePluginMock.TransitionType;
    }

    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }

    $window.geofence.onTransitionReceived = function(geofences) {
      $log.log(geofences);
      if (geofences) {
        $rootScope.$apply(function() {
          geofences.forEach(function(geo) {
            geo.notification = geo.notification || {
              title: "Geofence transition",
              text: "Without notification"
            };
            $ionicLoading.show({
              template: geo.notification.title + ": " + geo.notification.text,
              noBackdrop: true,
              duration: 2000
            });
          });
        });
      }
    };

    $window.geofence.onNotificationClicked = function(notificationData) {
      $log.log(notificationData);

      if (notificationData) {
        $rootScope.$apply(function() {
          $ionicLoading.show({
            template: "Notification clicked: " + notificationData.notification.text,
            noBackdrop: true,
            duration: 2000
          });

          $state.go("geofence", {
            geofenceId: notificationData.id
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
