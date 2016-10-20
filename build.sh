#! /bin/sh

echo "*************************"
echo "Now building android..."
echo "*************************"
ionic build android

echo "*************************"
echo "Now building ios..."
echo "*************************"
ionic build ios

echo "*************************"
echo "Now copying android to remote server..."
echo "*************************"
# scp /Users/fnokeke/dev/ionic-apps/ionic-geofence/platforms/android/build/outputs/apk/android-debug.apk fabian@slm.smalldata.io:~/mobile_apps

echo "*************************"
echo "Now launching xcode project and itunes connect website"
echo "*************************"
open "/Users/fnokeke/dev/ionic-apps/ionic-geofence/platforms/ios/Geo Places.xcodeproj"
open "https://itunesconnect.apple.com"
open "https://drive.google.com/drive/u/1/folders/0Bw3oSo0M3Ec9Rlc3SmRlY2hCRUU"


echo "*************************"
echo "Done :)"
echo "*************************"
