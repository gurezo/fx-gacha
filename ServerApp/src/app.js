$(function() {
    /*
     * ログ
     */
    function log(str) {
       $("#log pre").text(str + "\n" + $("#log pre").text());  
    }
    
    /**
     * ブラウザでのデバック用
     * URLの後ろに #param1=10&param2=30 とつけると擬似的にサーバーからの値をテストできる
     */
    function locationHashChanged() {
        if (location.hash) {
            var data = {};
            var queryList = location.hash.split('#')[1].split('&');
            for( var i = 0; i < queryList.length; i++ )
            {
                var element = queryList[i].split('=');
                var paramName = decodeURIComponent( element[ 0 ] );
                var paramValue = decodeURIComponent( element[ 1 ] );
                data[ paramName ] = paramValue;
            }
        }
        
        //デバック
        var now = new Date().toString();
        var strData = JSON.stringify(data, undefined, '  ');
        log(now + '\n' + strData);
        
        if(data.power){
            power = Number(data.power) + power;
        }
    }
    window.onhashchange = locationHashChanged;
    
    /*
     * サーバー接続
     */
    var server = new GetServer();
    
    server.open(function onOpened() {
        var msg = 'Running on ' + server.ipAddress + ':' + server.portNumber;
        $("#port").text(msg);
    });

    server.onData = function(data) {
        //デバック
        var now = new Date().toString();
        var strData = JSON.stringify(data, undefined, '  ');
        log(now + '\n' + strData);
        
        if(data.power){
            power = Number(data.power) + power;
        }
    };
    
    //画面中心位置
    var centerX = $(window).width() / 2;
    
    //カード中央位置
    var cardCenterX = Math.floor(($(window).width() - $("#card_back").width()) / 2);  
    var cardCenterY  = Math.floor(($(window).height() - $("#card_back").height()) / 2);  
    
    var power = 0;
    
    $("#logo").css({right: 40, bottom: 40});
    $("#port").css({left: 40, bottom: 40});
    

    init();
    
    /*
     * 初期化
     */
    function init() {
        power = 0;
        
        $("#card_back").css({opacity: 1, top: cardCenterY, left: centerX ,width: 0})
            .animate({width: 600,left: cardCenterX},{duration: 500, easing: "swing",complete: wait});
        $("#card_front").css({opacity: 0});
    }
    
    /*
     * 待ち画面アニメーション
     */
    function wait() {
        console.log("power : " + power);
        if(power < 100){
            $("#card_back").animate({top: cardCenterY + 20},{duration: 1000, easing: "swing"})
                .animate({top: cardCenterY - 20},{duration: 1000, easing: "swing", complete: wait});
        }else{
            cardFlash();
        }
    }
    
    /*
     * カードフラッシュアニメーション
     */
    function cardFlash(){
        $("#card_back").animate({"left":cardCenterX, "top": cardCenterY},{duration: 1000, easing: "swing"})
            .delay(2000).animate({opacity: 0},{duration: 1000});
        $("#card-flash1").delay(1000)
            .animate({opacity: 1},{duration: 1000})
            .animate({opacity: 0},{duration: 1000});
        $("#card-flash2").delay(1500)
            .animate({opacity: 1},{duration: 1000})
            .animate({opacity: 0},{duration: 1000});
        $("#whiteout").delay(2000)
            .animate({opacity: 1},{duration: 1000,complete: cardEntry})
            .animate({opacity: 0,},{duration: 2000});
    }
    
    /*
     * カード出現
     */
    function cardEntry(){
        var cardNum = Math.floor( Math.random() * 20 )+1;
        $("#card_front").css({"background-image": 'url(images/cards/'+ cardNum +'.jpg)', opacity: 1, width: 600, left:cardCenterX})
            .animate({width:900, height:1200, left:cardCenterX-150, top:cardCenterY-200 },{duration: 500, easing: "swing"})
            .animate({width:600, height:800, left:cardCenterX, top:cardCenterY },{duration: 100, easing: "swing"})
            .delay(2000)
            .animate({width: 0,left: centerX},{duration: 500, easing: "swing",complete: init})

    }
    
});