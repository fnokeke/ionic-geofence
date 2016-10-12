angular.module("ionic-geofence").controller("GeofenceCtrl", function($scope, $ionicLoading, $window, $state,
  geofenceStateParam, Geofence) {
  console.log('geofenceStateParam: ', geofenceStateParam);

  var
    gapi,
    mapOptions;

  gapi = $window.google.maps;

  mapOptions = {
    center: {
      lat: 40.74095729999999,
      lng: -74.00211869999998,
    },
    zoom: 13,
    disableDefaultUI: true, // DISABLE MAP TYPE
    scrollwheel: false
  };

  $scope.map = new gapi.Map(document.getElementById('map'), mapOptions);
  $scope.geofence = geofenceStateParam;
  $scope.TransitionType = $window.TransitionType;

  $scope.markers = {
    marker: {
      draggable: true,
      message: $scope.geofence.notification.title,
      lat: $scope.geofence.latitude,
      lng: $scope.geofence.longitude,
      icon: {}
    }
  };

  $scope.paths = {
    circle: {
      type: "circle",
      radius: $scope.geofence.radius,
      latlngs: $scope.markers.marker,
      clickable: false
    }
  };

  add_autocomplete_address($scope.map);

  function add_autocomplete_address(map) {
    var
      defaultBounds,
      options,
      autocomplete;

    // Bias the autocomplete object to the user's geographical location FIXME: why auto-location not working for maps
    // as supplied by the browser's 'navigator.geolocation' object.
    defaultBounds = new gapi.LatLngBounds(new gapi.LatLng(40.74095729999999, -74.00211869999998));
    options = {
      bounds: defaultBounds,
      types: ['address']
    };
    autocomplete = new gapi.places.Autocomplete(document.getElementById('autocomplete_field'), options);

    gapi.event.addListener(autocomplete, 'place_changed', function() {
      console.log('place_changed listener triggered...');
      console.assert(autocomplete);

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
        $scope.geofence.notification.text = place.formatted_address;
        add_marker($scope.map, $scope.geofence);

      } else {
        console.log('Error no place geometry: ', place.geometry);
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    });
  }

  // $scope.$watch('geofence', function() {
  //   console.log('******************');
  //   console.log('geofence changed!!!');
  //   console.log('******************');
  // });

  add_marker($scope.map, $scope.geofence);

  function add_marker(map, geofence) {
    console.log('marker to add: ', geofence);
    var
      latLng,
      marker,
      title,
      infowindow;

    latLng = {
      lat: geofence.latitude,
      lng: geofence.longitude,
    };
    map.setCenter(latLng);

    if (geofence.notification.text) {
      marker = new gapi.Marker({
        map: map,
        position: latLng,
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/circle.png',
          anchor: new gapi.Point(10, 10),
          scaledSize: new gapi.Size(10, 17)
        }
      });

      infowindow = new gapi.InfoWindow();

      title = geofence.notification.title || geofence.notification.text.split(',')[0];
      infowindow.setContent('<div><strong>' + title + '</strong><br>' + geofence.notification.text + '</div>');
      infowindow.setPosition(latLng);
      infowindow.open(map, marker);
    }

  }

  $scope.disableTap = function() {
    var container = document.getElementsByClassName('places-container');
    var backdrop = document.getElementsByClassName('backdrop');
    var autocomplete_field = document.getElementById('autocomplete_field');

    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(backdrop).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function() {
      autocomplete_field.blur();
    });
  };

  $scope.isTransitionOfType = function(transitionType) {
    return ($scope.geofence.transitionType & transitionType);
  };

  $scope.isWhenGettingCloser = function() {
    return $scope.geofence.transitionType === $window.TransitionType.ENTER;
  };

  $scope.toggleWhenIgetCloser = function() {
    $scope.geofence.transitionType ^= $window.TransitionType.ENTER;
  };

  $scope.toggleWhenIamLeaving = function() {
    $scope.geofence.transitionType ^= $window.TransitionType.EXIT;
  };

  $scope.save = function() {
    if (validate()) {
      $scope.geofence.radius = parseInt($scope.paths.circle.radius);
      $scope.geofence.notification.data = angular.copy($scope.geofence);

      // $scope.geofence.latitude = $scope.markers.marker.lat;
      // $scope.geofence.longitude = $scope.markers.marker.lng;

      Geofence.addOrUpdate($scope.geofence).then(function() {
        console.log('geofence added: ', $scope.geofence);
        $state.go("geofences");
      }, function(error) {
        $ionicLoading.show({
          template: "Failed to add geofence, check if your location provider is enabled",
          duration: 3000
        });
        console.log("Failed to add geofence", error);
      });
    }
  };

  function validate() {

    if (!$scope.geofence.notification.title) { // TODO: refactor ionicLoading
      $ionicLoading.show({
        template: "Please enter some notification text.",
        duration: 3000
      });
      return false;
    }

    if (!$scope.geofence.notification.text) {
      console.log('geofence.notification.text: ', $scope.geofence.notification.text);
      $ionicLoading.show({
        template: "Please enter your address.",
        duration: 3000
      });
      return false;
    }

    if ($scope.geofence.transitionType === 0) {
      $ionicLoading.show({
        template: "You must select when you want notification. When entering or/and exiting region?",
        duration: 3000
      });
      return false;
    }

    return true;
  }
});

// FIXME: InvalidValueError: not a LatLngBounds or LatLngBoundsLiteral: not an Object
// TODO: replace magic numbers with defined constants
