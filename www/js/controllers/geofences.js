angular.module("ionic-geofence").controller("GeofencesCtrl", function($ionicPlatform, $window, $scope,
  $ionicActionSheet, $timeout, $log, $state, GeoLocation, GeoService, $ionicLoading) {

  $ionicLoading.show({
    template: "Getting geofences from device...",
    duration: 5000
  });

  $scope.geofences = [];

  GeoService.getAll().then(function(geofences) {
    $ionicLoading.hide();
    $scope.geofences = geofences;
  }, function(reason) {
    $ionicLoading.hide();
    $log.error("An Error has occured", reason);
  });

  $scope.createNew = function() {
    $ionicLoading.show({
      template: "Loading map...",
      hideOnStateChange: true
    });

    GeoLocation.getCurrentPosition()
      .then(
        function(position) {
          var lat, lng;
          lat = position.coords.latitude;
          lng = position.coords.longitude;

          $log.info("Current position found", position);

          if (lat === 31.0461 && lng === 34) { // sometimes browser give wrong geolocation so use NYC
            lat = 40.74095729999999;
            lng = -74.00211869999998;
          }

          $state.go("geofence-new", {
            latitude: lat,
            longitude: lng
          });
        },
        function(reason) {
          $log.error("Cannot obtain current location", reason);
          $ionicLoading.show({
            template: "Cannot obtain current location",
            duration: 1500
          });
        });
  };

  $scope.editGeofence = function(geofence) {
    $state.go("geofence-edit", {
      geofenceId: geofence.id
    });
  };

  $scope.removeGeofence = function(geofence) {
    GeoService.remove(geofence);
  };

  $scope.more = function() {
    // Show the action sheet
    $ionicActionSheet.show({
      titleText: "More options",
      buttons: [{
        text: "<i class='icon ion-checkmark-circled'></i> Test application"
      }],
      destructiveText: "<i class='icon ion-trash-b'></i> Delete all geofences",
      cancelText: "<i class='icon ion-android-cancel'></i> Cancel",
      destructiveButtonClicked: function() {
        GeoService.removeAll();
        return true;
      },
      buttonClicked: function() {
        $ionicLoading.show({
          template: "Come back tmrw :D",
          duration: 1500
        });
        // window.location.href = "cdvtests/index.html";
      }
    });
  };
});
