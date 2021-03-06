angular.module("ionic-geofence").controller("GeodetailCtrl", function($scope, $ionicPlatform, $window, $state,
  $rootScope, $cordovaNetwork, geofenceStateParam, Display, GeoService) {

  var
    gapi,
    mapOptions;

  gapi = $window.google.maps;

  mapOptions = {
    center: {
      lat: 40.74095729999999,
      lng: -74.00211869999998,
    },
    zoom: 16,
    disableDefaultUI: true, // DISABLE MAP TYPE
    scrollwheel: false
  };

  $scope.is_ios = $ionicPlatform.is('ios');
  $scope.map = new gapi.Map(document.getElementById('map'), mapOptions);
  $scope.geofence = geofenceStateParam;
  $scope.title = '';
  $scope.TransitionType = $window.TransitionType;
  $scope.is_disconnected = false;

  $rootScope.$on('$cordovaNetwork:offline', function() {
    $scope.is_disconnected = true;
  });

  $rootScope.$on('$cordovaNetwork:online', function() {
    $scope.is_disconnected = false;
  });

  $scope.circle = new gapi.Circle({
    map: $scope.map,
    radius: 150,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });

  $scope.marker = new gapi.Marker({
    map: $scope.map,
    icon: {
      url: 'https://maps.gstatic.com/mapfiles/circle.png',
      anchor: new gapi.Point(10, 10),
      scaledSize: new gapi.Size(10, 17)
    }
  });

  $scope.updateRadius = function() {
    $scope.circle.bindTo('center', $scope.marker, 'position');
    var radius = $scope.geofence.radius ? parseInt($scope.geofence.radius) : 100;
    $scope.circle.setRadius(radius);
  };

  $scope.updateRadius();

  add_autocomplete_address($scope.map);

  function add_autocomplete_address(map) {
    var
      defaultBounds,
      options,
      autocomplete;

    // Bias the autocomplete object to the user's geographical location
    // as supplied by the browser's 'navigator.geolocation' object.
    defaultBounds = new gapi.LatLngBounds(new gapi.LatLng(40.74095729999999, -74.00211869999998));
    options = {
      bounds: defaultBounds
    };
    autocomplete = new gapi.places.Autocomplete(document.getElementById('autocomplete_field'), options);

    gapi.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.location) {
        console.log('place: ', place.formatted_address);
        console.log('place latLng: ', '(' + place.geometry.location.lat() + ',' + place.geometry.location.lng() +
          ')');

        $scope.geofence.latitude = place.geometry.location.lat();
        $scope.geofence.longitude = place.geometry.location.lng();
        $scope.geofence.text = place.formatted_address;

        add_marker($scope.map, $scope.geofence);

      } else {
        console.log('Error no place geometry: ', place.geometry);
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    });
  }

  add_marker($scope.map, $scope.geofence);

  function add_marker(map, geofence) {
    var
      latLng,
      title,
      infowindow;

    latLng = {
      lat: geofence.latitude,
      lng: geofence.longitude,
    };
    map.setCenter(latLng);

    if (geofence.text) {
      $scope.marker.setPosition(latLng);
      infowindow = new gapi.InfoWindow();
      title = geofence.title || geofence.text.split(',')[0];
      infowindow.setContent('<div><strong>' + title + '</strong><br>' + geofence.text + '</div>');
      infowindow.setPosition(latLng);
      infowindow.open(map, $scope.marker);
    }

  }
  $scope.disableTap = function() {
    console.log('data-tap-disabled');

    var container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    var backdrop = document.getElementsByClassName('backdrop');
    angular.element(backdrop).attr('data-tap-disabled', 'true');

    angular.element(container).on("click", function() {
      document.getElementById('autocomplete_field').blur();
      console.log('blur complete');
    });
  };

  $scope.isTransitionOfType = function(transitionType) {
    return ($scope.geofence.transitionType & transitionType);
  };

  $scope.toggleWhenIgetCloser = function() {
    $scope.geofence.transitionType ^= $window.TransitionType.ENTER;
  };

  $scope.toggleWhenIamLeaving = function() {
    $scope.geofence.transitionType ^= $window.TransitionType.EXIT;
  };

  $scope.save = function() {
    if (validate()) {
      $scope.geofence.radius = parseInt($scope.geofence.radius);

      // activate default geofence notification but disable vibration
      // this should only be used if you don't plan to passively tracking geotriggers
      // or if you want to notify the user of transitions
      $scope.geofence.notification = {
        'title': $scope.geofence.title,
        'text': $scope.geofence.text,
        'vibration': [0]
      };

      console.log('geofence to save: ', $scope.geofence);

      GeoService.addOrUpdate($scope.geofence).then(function() {
        $state.go("geofences");
      }, function(error) {
        Display.prompt('Failed to add geofence. Contact admin.');
        console.log("Failed to add geofence:", error);
      });
    }
  };

  function validate() {
    if (!$scope.geofence.title) {
      Display.prompt('Please enter some notification text.');
      return false;
    }

    if (!$scope.geofence.text) {
      console.log('geofence.text: ', $scope.geofence.text);
      Display.prompt('Please enter your address.');
      return false;
    }

    if ($scope.geofence.transitionType === 0) {
      Display.prompt('You must select when you want notification. When entering or/and exiting region?');
      return false;
    }

    return true;
  }
});

// TODO: replace magic numbers with defined constants
// TODO: alert user if no network while using google maps autocomplete
// TODO: stop loading map msg in case location doesn't load
