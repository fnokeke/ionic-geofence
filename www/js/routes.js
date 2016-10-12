angular.module("ionic-geofence").config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("geofences", {
      url: "/geofences",
      templateUrl: "templates/geofences.html",
      controller: "GeofencesCtrl"
    })
    .state("geofence-new", {
      url: "/geofence/new/:longitude,:latitude",
      templateUrl: "templates/geofence-detail.html",
      controller: "GeofenceCtrl",

      resolve: {
        geofenceStateParam: function($stateParams, GeoService) {
          return GeoService.create({
            longitude: parseFloat($stateParams.longitude),
            latitude: parseFloat($stateParams.latitude)
          });
        }
      }
    })
    .state("geofence-edit", {
      url: "geofence/:geofenceId",
      templateUrl: "templates/geofence-detail.html",
      controller: "GeofenceCtrl",

      resolve: {
        geofenceStateParam: function($stateParams, GeoService, $q) {
          var geofence = GeoService.findById($stateParams.geofenceId);

          if (geofence) {
            console.log('edit geofence: ', geofence);
            return $q.when(angular.copy(geofence));
          }

          return $q.reject("Cannot find geofence with id: " + $stateParams.geofenceId);
        }
      }
    });

  $urlRouterProvider.otherwise("/geofences");
});
