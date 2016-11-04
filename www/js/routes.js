angular.module("ionic-geofence").config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state("geofences", {
    url: "/geofences",
    templateUrl: "templates/geofences.html",
    controller: "GeofencesCtrl"
  })

  .state("geofence-new", {
    url: "/geofence/new/:longitude,:latitude",
    templateUrl: "templates/geodetail.html",
    controller: "GeodetailCtrl",

    resolve: {
      geofenceStateParam: function($stateParams, GeoService) {
        console.log('geofence state param called.', $stateParams);
        return GeoService.create({
          longitude: parseFloat($stateParams.longitude),
          latitude: parseFloat($stateParams.latitude)
        });
      }
    }
  })

  .state("geofence-edit", {
    url: "geofence/:geofenceId",
    templateUrl: "templates/geodetail.html",
    controller: "GeodetailCtrl",

    resolve: {
      geofenceStateParam: function($stateParams, $q, GeoService) {
        var geofence = GeoService.findById($stateParams.geofenceId);
        console.log('edit findById geofence: ', geofence);

        if (geofence) {
          return $q.when(angular.copy(geofence));
        }

        return $q.reject("Cannot find geofence with id: " + $stateParams.geofenceId);
      }
    }
  })

  .state("logs", {
    url: "/logs",
    templateUrl: "templates/logs.html",
    controller: "LogsCtrl"
  });

  $urlRouterProvider.otherwise("/geofences");
});
