angular.module("ionic-geofence").factory("GeoLocation", function($q) {

  return {
    getCurrentPosition: function() {
      var deffered = $q.defer();
      var position = {
        'coords': {
          'latitude': 40.74095729999999,
          'longitude': -74.00211869999998,
          'accuracy': 1000
        }
      };
      deffered.resolve(position);

      // navigator.geolocation.getCurrentPosition(
      //   function(position) {
      //     console.info('GeoLocation position: ', position);
      // if (position.coords.latitude === 31.0461 && position.coords.longitude === 34) { // sometimes browser give wrong geolocation so use NYC
      //   position.coords.latitude = 40.74095729999999;
      //   position.coords.longitude = -74.00211869999998;
      // }
      //     deffered.resolve(position);
      //   },
      //   function(error) {
      //     console.log('GeoLocation error: ', error);
      //     deffered.reject(error);
      //   }, {
      //     timeout: 10000,
      //     enableHighAccuracy: true
      //   });

      return deffered.promise;
    }
  };
});
