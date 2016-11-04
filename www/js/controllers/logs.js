angular.module("ionic-geofence").controller("LogsCtrl", function($scope, LogData) {

  $scope.logs = LogData.fetch_all_logs();

  $scope.refresh = function() {
    $scope.logs = LogData.fetch_all_logs();
    console.log('logs: ', $scope.logs);
  };

});
