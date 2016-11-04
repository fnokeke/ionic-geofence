angular.module("ionic-geofence").factory("GeoLocation", function($q) {

  return {
    getCurrentPosition: function() {
      var deffered = $q.defer();
      var default_position = { // stopped using getCurrentPosition and instead returning hardcoded values as default
        'coords': {
          'latitude': 40.74095729999999,
          'longitude': -74.00211869999998,
          'accuracy': 100
        }
      };
      deffered.resolve(default_position);

      return deffered.promise;
    }
  };
});
