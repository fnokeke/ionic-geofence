# Geo Places App

[![Build Status](https://travis-ci.org/cowbell/ionic-geofence.svg?branch=master)](https://travis-ci.org/cowbell/ionic-geofence)

Geo Places App using [cordova geofence plugin](https://github.com/tsubik/cordova-plugin-geofence) and forked from Tomasz Subik's
[ionic-geofence app](https://github.com/cowbell/ionic-geofence).

## Description
Using Google Places autocomplete, you can create geofences in specific locations, which trigger notifications upon entry or exit.
![ionic-geofence](https://cloud.githubusercontent.com/assets/1286444/4302807/604c7c5e-3e5e-11e4-87df-99b22abffdc8.jpg)

## Installation

Use local npm packages

```
npm install
bower install
```

For testing in browser

```
ionic serve
```

For android

```
ionic platform add android
ionic run android
```

For iOS

```
ionic platform add ios
ionic run ios
```

## Platforms

- Android (google repository and google play store services must be installed for Google Maps to work. Use android studio to install.)
- iOS

## License

This software is released under the [MIT License](https://raw.githubusercontent.com/tsubik/ionic-geofence/master/LICENSE).

© 2016 Fabian Okeke. All rights reserved.
