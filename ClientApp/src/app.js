$(function () {
    
    "use strict";
    
    var gammaOld = 0,
        gammaDiff = 0,
        zeroCount = 0;
    
    function init() {
        //ポートレートでロック
        //FIXME ロックできない
        screen.mozLockOrientation(["portrait"]);
        //デバイスの方向変化イベント
        window.addEventListener("deviceorientation", handleOrientation, true);
    }
    
    /*
     * デバイスの方向変化イベントハンドラ
     */
    function handleOrientation(orientData) {
        var gamma = orientData.gamma / 2;
        
        gammaDiff = Math.round(Math.abs(gammaOld - gamma));
        gammaOld = gamma;
        
        if (gammaDiff > 30) {
            //送信
            sendXHR(gammaDiff);
            //gammaDiffを表示
            $("#gauge div").text(gammaDiff);
            //雷表現
            $("#lightning").css({opacity: 1})
                .animate({opacity: 0}, {duration: 1000});
            zeroCount = 0;
        } else {
            zeroCount++;
            if (zeroCount === 50) {
                //zeroCountが50を超えたら表示を戻す
                $("#gauge div").text("振れ!");
                $("#ipaddress p").html("<a href='http://www.jewel-s.jp/' target='_blank'>ジュエルセイバーFREE</a>");
            }
        }
    }
    
    /*
     * 非同期リクエスト送信
     */
    function sendXHR(num) {
        var destination = "http://" + $(':text[name="ipaddress"]').val() + "/put?power=" + num,
            //{mozSystem: true}というオブジェクトを渡さないとクロスドメインで怒られる
            xhr = new XMLHttpRequest({mozSystem: true});
        
        //初期化
        xhr.open("GET", destination, true);
        
        //ステータス変化イベント
        xhr.onreadystatechange = function () {
            console.log("xhr.readyState: " + xhr.readyState);
            console.log("xhr.status: " + xhr.status);
        };
        
        //ロード完了イベント
        xhr.onload = function (e) {
            console.log("xhr.readyState: " + xhr.readyState);
            if (xhr.readyState === 4) {
                //リクエスト終了
                console.log("xhr.status: " + xhr.status);
                if (xhr.status === 200) {
                    //正常完了
                    console.log("xhr.responseText: " + xhr.responseText);
                    $("#ipaddress p").text("送信完了");
                } else {
                    //異常完了
                    console.error("xhr.statusText: " + xhr.statusText);
                }
            }
        };
        
        //エラーイベント
        xhr.onerror = function (e) {
            console.error("xhr.statusText: " + xhr.statusText);
            $("#ipaddress p").text("接続エラー");
        };
        
        //送信
        xhr.send(null);
        console.log("XMLHttpRequest.send " + destination);
        $("#ipaddress p").text("接続開始");
    }

    init();
    
});