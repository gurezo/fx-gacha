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
    
    
    var power = 100;
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
            power = power - Math.floor(gammaDiff / 20) ;
             $("#gauge p").text(power);
            
            if(power <= 0){
                var destination = "http://" + $(':text[name="ipaddress"]').val() + "/put?power=1000";
                log(destination);
                var req = new XMLHttpRequest({mozSystem: true});
                req.open('GET', destination, true);
                req.onreadystatechange = function(aEvt){
                    if(req.readyState == 4){
                        console.log('req.readyState == ' + req.readyState);
                        if(req.status == 200){
                            console.log(req.responseText);
                        }else{
                        //
                        }
                    }
                };
                req.send(null);
                
                power = 100;
            }
        }
    }
    
    
    
});