angular.module('flux.controllers', [])
  .controller('AlarmCtrl', function($scope, MeshbluService){

    $scope.timeSets = {
      goToSleep : {
        label : "Night Time",
        hour: '11',
        minute: '00',
        timeOfDay: 'PM'
      },
      wakeUp: {
        label : 'Wake Up Alarm',
        hour: '06',
        minute: '00',
        timeOfDay: 'AM'
      }
    };

    var addPadding = function(num){
      return num > 9 ? num : '0' + num;
    };

    var sendTime = function(){
      MeshbluService.getConnection().then(function(conn){
        var messageObj = {
          devices : '*',
          topic : 'superneato',
          payload : {}
        };
        _.each(_.keys($scope.timeSets), function(timeSet){
          messageObj.payload[timeSet] = _.clone($scope.timeSets[timeSet]);
          delete messageObj.payload[timeSet].label;
        });
        conn.message(messageObj, function(){
          console.log('Messaged', messageObj);
        });
        var updateObj = messageObj.payload;
        conn.update(updateObj, function(){
          console.log('Messaged', updateObj);
        });
      });
    };

    var debounceSendTime = _.debounce(sendTime, 1000);

    $scope.pageTitle = 'Setup Alarm';

    $scope.timeOfDays = ['AM', 'PM'];

    $scope.hours = [];
    for(var i = 1; i <= 12; i++){
      $scope.hours.push(addPadding(i));
    }

    $scope.minutes = [];
    for(var x = 0; x < 60; x++){
      $scope.minutes.push(addPadding(x));
    }

    MeshbluService.getConnection().then(function(conn){
      conn.whoami({ uuid : MeshbluService.connObj.uuid }, function(data){
        _.each(_.keys($scope.timeSets), function(timeSet){
          var timeSetData = _.clone(data[timeSet] || {});
          delete timeSetData.label;
          $scope.timeSets[timeSet] = _.extend({}, $scope.timeSets[timeSet], timeSetData);

          $scope.$apply();
          $scope.$watch('timeSets.' + timeSet, debounceSendTime, true);
          $scope.$watch('timeSets.' + timeSet, debounceSendTime, true);
          $scope.$watch('timeSets.' + timeSet, debounceSendTime, true);
        });
      });
    });

  });