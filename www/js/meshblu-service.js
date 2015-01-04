angular.module('flux.services', [])
  .service('MeshbluService', function($q) {
    var self = this, conn;

    function getConfig(){
      return {
        uuid: window.localStorage.getItem('uuid'),
        token: window.localStorage.getItem('token'),
      };
    }
    function setConfig(config){
      self.connObj.uuid = config.uuid;
      window.localStorage.setItem('uuid', config.uuid);
      self.connObj.token = config.token;
      window.localStorage.setItem('token', config.token);
    }

    self.connObj = _.extend({ type : 'flux-home' }, getConfig());
    console.log(JSON.stringify(self.connObj));

    self.getConnection = function(){
      var defer = $q.defer();
      if(conn){
        defer.resolve(conn);
      }else{
        conn = skynet.createConnection(self.connObj);
        conn.on('ready', function(config){
          setConfig(config);
          defer.resolve(conn);
        });
        conn.on('notReady', function(error){
          console.error(error);
          defer.reject();
        });
      }
      return defer.promise;
    };

    return self;
  });
