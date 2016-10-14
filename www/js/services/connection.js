angular.module("ionic-geofence").factory('Connection', function($window, $ionicPlatform, $rootScope, Display) {

  return {

    start_watching: function() {
      // if ($ionicPlatform) {
      // $rootScope.$on('$cordovaNetwork:online', function() {
      //   console.log('You are online');
      // });
      //
      // $rootScope.$on('$cordovaNetwork:offline', function() {
      //   Display.show_toast('You are currently offline');
      // });
      //
      // } else {

      $window.addEventListener("online", function() {
        console.log('You are online');
      }, false);

      $window.addEventListener("offline", function() {
        Display.show_toast('You are currently offline');
      }, false);

      // }
    }

  }; // return

});
