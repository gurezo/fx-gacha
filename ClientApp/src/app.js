$(function() {    
    
    //ポートレートでロック
    //FIXME ロックできない
    screen.mozLockOrientation(["portrait"]);
    
    var gammaOld = 0;
    var gammaDiff = 0;
    var zeroCount = 0;
    
    /*
     * デバイスの方向変化イベント
     */
    window.addEventListener("deviceorientation", handleOrientation, true);
    
    function handleOrientation(orientData) {
        gammaDiff = Math.round(Math.abs(gammaOld - orientData.gamma));
        gammaOld = orientData.gamma;
        
        if(gammaDiff > 30){
            console.log("gammaDiff: " + gammaDiff)
            sendXHR();
            $("#gauge p").text(gammaDiff);
            zeroCount = 0;
        }else{
            zeroCount ++;
            if(zeroCount == 50){
                $("#gauge p").text("振れ!"); 
                $("#ipaddress p").html("<a href='http://www.jewel-s.jp/' target='_blank'>ジュエルセイバーFREE</a>");
            }
        }
    }
    
    /*
     * 非同期リクエスト送信
     */
    function sendXHR(){
        
        var destination = "http://" + $(':text[name="ipaddress"]').val() + "/put?power=" + (gammaDiff / 2);
        var xhr = new XMLHttpRequest({mozSystem: true});
        
        xhr.open("GET", destination, true);
        console.log(destination);
        $("#ipaddress p").text("接続開始");
        
        xhr.onreadystatechange = function(){
            console.log("xhr.readyState: " + xhr.readyState);
            console.log("xhr.status: " + xhr.status);
        }

        xhr.onload = function (e) {
            console.log("xhr.readyState: " + xhr.readyState);
          if (xhr.readyState === 4) {
              console.log("xhr.status: " + xhr.status);
            if (xhr.status === 200) {
              console.log("xhr.responseText: " + xhr.responseText);
              $("#ipaddress p").text("送信完了");
            } else {
              console.error("xhr.statusText: " + xhr.statusText);
            }
          }
        };
        
        xhr.onerror = function (e) {
          console.error("xhr.statusText: " + xhr.statusText);
          $("#ipaddress p").text("接続エラー");
        };
        
        xhr.send(null);
    }
    
});