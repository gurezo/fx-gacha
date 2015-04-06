(function() {
  var server = new GetServer();
  var requestArea = document.getElementById('request');

  server.open(function onOpened() {
    var msg = 'Running on ' + server.ipAddress + ':' + server.portNumber;
    document.getElementById('port').textContent = msg;
  });

  server.onData = function(data) {
    var now = new Date().toString();
    var strData = JSON.stringify(data, undefined, '  ');
    requestArea.textContent = now + '\n' + strData + '\n' + requestArea.textContent;
  };
})();
