angular.module("ionic-geofence").controller("GeofencesCtrl", function($ionicPlatform, $window, $scope,
  $ionicActionSheet, $timeout, $log, $state, GeoLocation, GeoService, $interval, Display, Connection) {

  Connection.start_watching();

  Display.prompt('Getting geofences from device...');

  $scope.geofences = [];

  GeoService.getAll().then(function(geofences) {
    Display.hide_prompt();
    $scope.geofences = geofences;
  }, function(reason) {
    Display.hide_prompt();
    $log.error("An Error has occured", reason);
  });

  $scope.createNew = function() {

    Display.prompt('Loading map...', true);
    GeoLocation.getCurrentPosition()
      .then(
        function(position) {

          var lat, lng;
          lat = position.coords.latitude;
          lng = position.coords.longitude;

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
          Display.prompt('Cannot obtain current location');
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
    console.log('more option was just clicked');
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
        Display.prompt('Come back tmrw :D');
        // window.location.href = "cdvtests/index.html";
      }
    });
  };
});
