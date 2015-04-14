$(function () {
    
    "use strict";
    
    var motionXOld = 0,
        zeroCount = 0;
    
    function init() {
        //ポートレートでロック
        screen.mozLockOrientation(["portrait"]);
        
        //デバイスの方向変化イベント
        window.addEventListener("devicemotion", handleMotionEvent, true);
    }
    
    /*
     * デバイスの方向変化イベントハンドラ
     */
    function handleMotionEvent(event) {
        var motionX = event.accelerationIncludingGravity.x,
            motionXDiff = Math.round(Math.abs(motionXOld - motionX) / 2);
        
        motionXOld = motionX;
        
        console.log("motionX : " + motionX);
        console.log("motionXDiff : " + motionXDiff);
        
        if (motionXDiff > 10) {
            //送信
            sendXHR(motionXDiff);
            //motionYDiffを表示
            $("#gauge div").text(motionXDiff);
            //雷表現
            $("#lightning").css({opacity: 1})
                .animate({opacity: 0}, {duration: 1000});
            zeroCount = 0;
        } else {
            zeroCount++;
            if (zeroCount === 20) {
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