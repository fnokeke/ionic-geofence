angular.module("ionic-geofence").controller("GeofenceCtrl", function($scope, $ionicLoading, $window, $state, geofence,
  Geofence) {
  $scope.geofence = geofence;
  $scope.TransitionType = $window.TransitionType;

  $scope.center = {
    // lat: 40.74095729999999, // default: Manhattan, NY
    // lng: -74.00211869999998,
    lat: $scope.geofence.latitude,
    lng: $scope.geofence.longitude,
    zoom: 12
  };

  $scope.markers = {
    marker: {
      draggable: true,
      message: geofence.notification.title,
      lat: $scope.geofence.latitude,
      lng: $scope.geofence.longitude,
      icon: {}
    }
  };

  $scope.paths = {
    circle: {
      type: "circle",
      radius: geofence.radius,
      latlngs: $scope.markers.marker,
      clickable: false
    }
  };

  map_and_geolocate();

  function map_and_geolocate() {
    var
      gapi,
      mapOptions,
      map,
      input,
      defaultBounds,
      options,
      autocomplete;

    gapi = $window.google.maps;

    mapOptions = {
      center: {
        lat: $scope.geofence.latitude,
        lng: $scope.geofence.longitude,
        // lat: 40.74095729999999,
        // lng: -74.00211869999998,
      },
      zoom: 13,
      disableDefaultUI: true, // DISABLE MAP TYPE
      scrollwheel: false
    };
    map = new gapi.Map(document.getElementById('map'), mapOptions);

    // Bias the autocomplete object to the user's geographical location FIXME: why auto-location not working for maps
    // as supplied by the browser's 'navigator.geolocation' object.
    defaultBounds = new gapi.LatLngBounds(new gapi.LatLng(40.74095729999999, -74.00211869999998));
    options = {
      bounds: defaultBounds,
      types: ['address']
    };

    input = document.getElementById('autocomplete_field');
    autocomplete = new gapi.places.Autocomplete(input, options);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function(position) {
    //     var geolocation, circle;
    //
    //     geolocation = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //
    //     circle = new gapi.Circle({
    //       center: geolocation,
    //       radius: position.coords.accuracy
    //     });
    //
    //     autocomplete.setBounds(circle.getBounds());
    //   });
    // }
    //
    gapi.event.addListener(autocomplete, 'place_changed', function() {

      var infowindow = new gapi.InfoWindow();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.location) {
        map.fitBounds(place.geometry.viewport);
        console.log('place chosen: ', place.formatted_address);

        $scope.geofence.latitude = place.geometry.location.lat();
        $scope.geofence.longitude = place.geometry.location.lng();
        $scope.geofence.notification.text = place.formatted_address;

      } else {
        console.log('Error no place geometry: ', place.geometry);
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Set the position of the marker using the place ID and location.
      var marker = new gapi.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/circle.png',
          anchor: new gapi.Point(10, 10),
          scaledSize: new gapi.Size(10, 17)
        }
      });

      marker.setPlace(({
        placeId: place.place_id,
        location: place.geometry.location
      }));

      marker.setVisible(true);
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '</div>');
      infowindow.open(map, marker);
    });

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
      console.log('geofence.notification.text: ', geofence.notification.text);
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
