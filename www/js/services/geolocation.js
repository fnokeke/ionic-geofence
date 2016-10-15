angular.module("ionic-geofence").factory("GeoLocation", function($q) {

  return {
    getCurrentPosition: function() {
      var deffered = $q.defer();

      navigator.geolocation.getCurrentPosition(
        function(position) {
          console.info('GeoLocation position: ', position);
          deffered.resolve(position);
        },
        function(error) {
          console.log('GeoLocation error: ', error);
          deffered.reject(error);
        }, {
          timeout: 10000,
          enableHighAccuracy: true
        });

      return deffered.promise;
    }
  };
});
