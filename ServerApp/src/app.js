$(function(){
    
    
    /*
     * ログ
     */
    function log(str){
       $("#log pre").text(str + "\n" + $("#log pre").text());  
    }
    
    /*
     * サーバー接続
     */
    var server = new GetServer();
    
    server.open(function onOpened() {
        var msg = 'Running on ' + server.ipAddress + ':' + server.portNumber;
        $("#port").text(msg);
    });

    server.onData = function(data) {
        var now = new Date().toString();
        var strData = JSON.stringify(data, undefined, '  ');
        log(now + '\n' + strData + '\n' + requestArea.textContent);
    };
    
    //中心位置
    var centerX = $(window).width() / 2;
    
    //カード中央位置
    var cardCenterX = Math.floor(($(window).width() - $("#card_back").width()) / 2);  
    var cardCenterY  = Math.floor(($(window).height() - $("#card_back").height()) / 2);  
    
    var power = 0;
    
    /*
     * 初期化
     */
    function init(){
        log("init");
        //光を非表示
        $("#card-flash1").css({opacity: 0});
        $("#card-flash2").css({opacity: 0});
        //カードを中央に配置
        $("#card_back").css({"top": cardCenterY,"left": centerX ,"width": 0});
        $("#card_front").css({"top": cardCenterY,"left": centerX,"width": 0});
        
        waitInit();
    }
    init();
    
    /*
     * 待ち画面初期アニメーション
     */
    function waitInit() {
        log("waitInit");
        $("#card_back").animate({"width": 600,"left": cardCenterX},{duration: 500, easing: "swing",complete: wait});
        
    }
    
    /*
     * 待ち画面アニメーション
     */
    function wait() {
        log("wait");
        
        $("#card_back").animate({"top": cardCenterY + 20},{duration: 1000,easing: "swing"})
            .animate({"top": cardCenterY - 20},{duration: 1000,easing: "swing", complete: wait});
    }
    

    
});