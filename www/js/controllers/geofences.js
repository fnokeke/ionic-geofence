  angular.module("ionic-geofence").controller("GeofencesCtrl", function($ionicPlatform, $window, $scope,
    $cordovaNetwork,
    $rootScope, $ionicActionSheet, $timeout, $log, $state, GeoLocation, GeoService, $interval, Display) {

    Display.prompt('Getting geofences from device...');

    $scope.geofences = [];

    GeoService.getAll().then(
      function(geofences) {
        Display.hide_prompt();
        $scope.geofences = geofences;
      },
      function(error) {
        Display.hide_prompt();
        $log.error("An Error has occured", error);
      });

    $scope.is_disconnected = false;

    $rootScope.$on('$cordovaNetwork:offline', function() {
      $scope.is_disconnected = true;
    });

    $rootScope.$on('$cordovaNetwork:online', function() {
      $scope.is_disconnected = false;
    });

    $scope.createNew = function() {

      if ($scope.is_disconnected) {
        Display.prompt('You need internet connection to add new geofences.');
        return;
      }

      Display.prompt('Loading map...', true);
      GeoLocation.getCurrentPosition().then(
        function(position) {
          var lat, lng;
          lat = position.coords.latitude;
          lng = position.coords.longitude;

          $state.go("geofence-new", {
            latitude: lat,
            longitude: lng
          });
        },
        function(reason) {
          $log.error("Cannot obtain current location", reason);
          Display.prompt('Cannot obtain current location');
        });
    };

    $scope.editGeofence = function(geofence) {
      if ($scope.is_disconnected) {
        Display.prompt('You need internet connection to edit geofence.');
        return;
      }

      $state.go("geofence-edit", {
        geofenceId: geofence.id
      });
    };

    $scope.removeGeofence = function(geofence) {
      GeoService.remove(geofence);
    };

    $scope.more = function() {
      var activate_text = localStorage.notify === "true" ?
        "<i class='icon ion-eye-disabled'></i> Disable Notifications" :
        "<i class='icon ion-ios-bell'></i> Enable Notifications";

      // Show the action sheet
      $ionicActionSheet.show({
        titleText: "More options",
        buttons: [{
          text: "<i class='icon ion-checkmark-circled'></i> View Logs"
        }, {
          text: activate_text
        }],
        cancelText: "<i class='icon ion-android-cancel'></i> Cancel",
        buttonClicked: function(position) {
          switch (position) {
            case 0:
              $state.go('logs');
              break;
            case 1:
              var msg = localStorage.notify === "true" ?
                "No geofence notifications will be showed." :
                "You will be notified of all geofence enter/exit triggers.";
              Display.prompt(msg);

              localStorage.notify = localStorage.notify === "true" ? "false" : "true";
              return true;
          }
        }
      });
    };
  });
