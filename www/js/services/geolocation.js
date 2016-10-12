angular.module("ionic-geofence").factory("GeoLocation", function($q, $interval) {
  var currentPositionCache;

  return {
    getCurrentPosition: function() {

      if (!currentPositionCache) {
        console.warn('currentPositionCache: ', currentPositionCache);
        var deffered = $q.defer();

        navigator.geolocation.getCurrentPosition(
          function(position) {
            deffered.resolve(currentPositionCache = position);
            $interval(function() {
              currentPositionCache = undefined;
              console.warn('interval launched.');
            }, 10000, 1);

          },
          function(error) {
            console.log('fetch geolocation error: ', error);
            deffered.reject(error);
          }, {
            timeout: 10000,
            enableHighAccuracy: true
          });

        return deffered.promise;
      } else {
        console.warn('currentPositionCache: ', currentPositionCache);
      }

      console.warn('final currentPositionCache: ', currentPositionCache);
      return $q.when(currentPositionCache);
    }
  };
});
