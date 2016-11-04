angular.module("ionic-geofence").factory("GeoService", function($rootScope, $window, $q, $log, Display, LogData) {

  var geofenceService = {
    _geofences: [],
    _geofencesPromise: null,

    create: function(attributes) {
      var default_geofence = {
        id: $window.UUIDjs.create().toString(),
        latitude: '',
        longitude: '',
        radius: 150,
        title: '',
        text: '',
        transitionType: $window.TransitionType.ENTER,
        notification: {
          id: this.getNextNotificationId(),
          title: "",
          text: "",
          icon: "res://ic_menu_mylocation",
          openAppOnClick: true
        }
      };

      return angular.extend(default_geofence, attributes);
    },

    loadFromLocalStorage: function() {
      var result = localStorage["geofences"];
      var geofences = [];

      if (result) {
        try {
          geofences = angular.fromJson(result);
        } catch (ex) {

        }
      }
      this._geofences = geofences;

      return $q.when(this._geofences);
    },

    saveToLocalStorage: function() {
      localStorage["geofences"] = angular.toJson(this._geofences);
    },

    loadFromDevice: function() {
      // var self = this;
      //
      // if ($window.geofence && $window.geofence.getWatched) {
      //   return $window.geofence.getWatched().then(function(geofencesJson) {
      //     console.log('geofencesJson: ', JSON.parse(geofencesJson));
      //     self._geofences = angular.fromJson(geofencesJson);
      //     return self._geofences;
      //   });
      // }

      return this.loadFromLocalStorage();
    },

    getAll: function() {
      var self = this;

      if (!self._geofencesPromise) {
        self._geofencesPromise = $q.defer();
        self.loadFromDevice().then(function(geofences) {
          self._geofences = geofences;
          self._geofencesPromise.resolve(geofences);
        }, function(reason) {
          $log.error("Error fetching geofences", reason);
          self._geofencesPromise.reject(reason);
        });
      }

      return self._geofencesPromise.promise;
    },

    addOrUpdate: function(geofence) {
      var self = this;

      return $window.geofence.addOrUpdate(geofence).then(function() {
        // console.log('setting geofence notification to {}');

        var searched = self.findById(geofence.id);

        if (!searched) {
          self._geofences.push(geofence);
        } else {
          var index = self._geofences.indexOf(searched);

          self._geofences[index] = geofence;
        }

        self.saveToLocalStorage();

        var dd = new Date();
        dd.setTime(dd.getTime() - 240 * 60 * 60); // NYC timezone
        dd = ' (' + dd.toLocaleString() + ')';
        LogData.save('added: ' + geofence.title.substr(0, 20) + dd);

      });
    },

    findById: function(id) {
      var geoFences = this._geofences.filter(function(g) {
        return g.id === id;
      });

      if (geoFences.length > 0) {
        return geoFences[0];
      }

      return undefined;
    },

    remove: function(geofence) {
      var self = this;
      Display.prompt('Removing geofence...');

      $window.geofence.remove(geofence.id).then(function() {
        Display.hide_prompt();

        self._geofences.splice(self._geofences.indexOf(geofence), 1);
        self.saveToLocalStorage();

        var dd = new Date();
        dd.setTime(dd.getTime() - 240 * 60 * 60); // NYC timezone
        dd = ' (' + dd.toLocaleString() + ')';
        LogData.save('removed: ' + geofence.title.substr(0, 20) + dd);

      }, function(reason) {
        $log.error('Error while removing geofence', reason);
        Display.prompt('Error while removing geofence.');
      });
    },

    removeAll: function() {
      var self = this;

      Display.prompt('Removing all geofences...');
      $window.geofence.removeAll().then(function() {
        Display.hide_prompt();

        self._geofences.length = 0;
        self.saveToLocalStorage();
      }, function(reason) {
        $log.error('Error while removing all geofences: ', reason);
        Display.prompt('Error while removing all geofences.');
      });
    },

    getNextNotificationId: function() {
      var max = 0;

      this._geofences.forEach(function(gf) {
        if (gf.notification && gf.notification.id) {
          if (gf.notification.id > max) {
            max = gf.notification.id;
          }
        }
      });

      return max + 1;
    }
  };

  return geofenceService;
});
