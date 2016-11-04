angular.module("ionic-geofence").factory("LogData", function() {

  return {

    save: function(string) {
      var logs = localStorage.logs ? JSON.parse(localStorage.logs) : [];
      logs.push(string);
      localStorage.setItem('logs', JSON.stringify(logs));
    },

    fetch_all_logs: function() {
      var logs = localStorage.getItem('logs');
      return logs ? JSON.parse(logs) : [];
    }

  };
});
