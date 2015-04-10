$(function() {
    /*
     * ログ
     */
    function log(str) {
       $("#log pre").text(str + "\n" + $("#log pre").text());  
    }
    
    
    $.ajaxSetup( {
      xhr: function() {
        return new window.XMLHttpRequest( {
          mozSystem: true
        } );
      }
    } );
    
    var gamma = 0;
    
    /*
     * デバイスの方向変化イベント
     */
    window.addEventListener("deviceorientation", handleOrientation, true);
    
    function handleOrientation(orientData) {

        var gammaDiff = Math.abs(gamma - orientData.gamma);
        
        gamma = orientData.gamma;
        
        if(gammaDiff > 30){
            log("gammaDiff : " + gammaDiff);
            

            //GETを送る
            var destination = "http://" + $(':text[name="ipaddress"]').val() + "/put?power=" + gammaDiff;
            log(destination);
            var xhr = new XMLHttpRequest({mozSystem: true});
            xhr.open("GET", destination, true);

            xhr.onreadystatechange = function(){
                console.log('xhr.readyState: ' + xhr.readyState);
                console.log('xhr.status: ' + xhr.status);
            }

            xhr.onload = function (e) {
                console.log('xhr.readyState: ' + xhr.readyState);
              if (xhr.readyState === 4) {
                  console.log('xhr.status: ' + xhr.status);
                if (xhr.status === 200) {
                  console.log(xhr.responseText);
                } else {
                  console.error(xhr.statusText);
                }
              }
            };
            xhr.onerror = function (e) {
              console.error(xhr.statusText);
            };
            xhr.send(null);


            //TODO
            $("#gauge p").text("振れ!");

        }
    }
    
    
    
});