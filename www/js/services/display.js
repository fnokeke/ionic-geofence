angular.module("ionic-geofence").factory("Display", function($ionicLoading, $ionicPlatform, $timeout) {

  return {

    prompt: function(msg, state) {
      state = state ? true : false;
      $ionicLoading.show({
        template: msg,
        hideOnStateChange: state,
        duration: 3000
      });
    },

    hide_prompt: function() {
      $ionicLoading.hide();
    },

    is_mobile: function() {
      return $ionicPlatform.is('android') || $ionicPlatform.is('ios');
    },

    show_toast: function(text) {
      if (this.is_mobile()) {
        $timeout(function() {
          window.plugins.toast.showLongBottom(text);
        }, 100);
      } else {
        console.log(text);
      }
    }

  };
});
