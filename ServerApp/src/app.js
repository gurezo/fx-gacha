$(function () {
    
    "use strict";
    
    var power = 0,
        server = new GetServer(),
        centerX = $(window).width() / 2,
        cardCenterX = Math.floor(($(window).width() - $("#card_back").width()) / 2),
        cardCenterY  = Math.floor(($(window).height() - $("#card_back").height()) / 2),
        powerNumZIndex = 10;
    
    /*
     * 初期化
     */
    function init() {
        //要素の位置調整
        $("#logo").css({right: 40, bottom: 40});
        $("#port").css({left: 40, bottom: 40});
        
        //サーバー初期化イベント
        server.open(function onOpened() {
            //IPアドレスを表示
            var msg = 'Running on ' + server.ipAddress + ':' + server.portNumber;
            $("#port").html(msg + "<br />ジュエルセイバーFREE http://www.jewel-s.jp/");
        });

        //サーバークエリー取得イベント
        server.onData = function (data) {
            //デバック
            var now = new Date().toString(),
                strData = JSON.stringify(data, undefined, '  ');

            console.log(now + '\n' + strData);

            if (data.power) {
                power = Number(data.power) + power;
                //パワー数値表示
                viewPower(data.power);
            }
        };
        
        //ハッシュ変化イベント
        window.onhashchange = locationHashChanged;
        
        //アニメーション開始
        animateStart();
    }
    
    /*
     * アニメーション開始
     */
    function animateStart() {
        
        power = 0;
        
        $("#card_back").css({opacity: 1, top: cardCenterY, left: centerX, width: 0})
            .animate({width: 600, left: cardCenterX}, {duration: 500, easing: "swing", complete: wait});
        $("#card_front").css({opacity: 0});
    }
    
    /*
     * 待ち画面アニメーション
     */
    function wait() {
        console.log("power : " + power);
        if (power < 100) {
            $("#card_back").animate({top: cardCenterY + 20}, {duration: 1000, easing: "swing"})
                .animate({top: cardCenterY - 20}, {duration: 1000, easing: "swing", complete: wait});
        } else {
            cardFlash();
        }
    }
    
    /*
     * カードフラッシュアニメーション
     */
    function cardFlash() {
        $("#card_back").animate({"left": cardCenterX, "top": cardCenterY}, {duration: 1000, easing: "swing"})
            .delay(2000).animate({opacity: 0}, {duration: 1000});
        $("#card-flash1").delay(1000)
            .animate({opacity: 1}, {duration: 1000})
            .delay(1000)
            .animate({opacity: 0}, {duration: 1000});
        $("#card-flash2").delay(1500)
            .animate({opacity: 1}, {duration: 1000})
            .animate({opacity: 0}, {duration: 1000});
        $("#whiteout").delay(2000)
            .animate({opacity: 1}, {duration: 1000, complete: cardEntry})
            .animate({opacity: 0}, {duration: 2000});
    }
    
    /*
     * カード出現
     */
    function cardEntry() {
        //ランダム
        var cardNum = Math.floor(Math.random() * 20) + 1;
        //#card_frontのbackground-imageをカード画像に置き換えてアニメーション
        $("#card_front").css({"background-image": 'url(images/cards/' + cardNum + '.jpg)', opacity: 1, width: 600, left: cardCenterX})
            .animate({width: 900, height: 1200, left: cardCenterX - 150, top: cardCenterY - 200}, {duration: 500, easing: "swing"})
            .animate({width: 600, height: 800, left: cardCenterX, top: cardCenterY }, {duration: 100, easing: "swing"})
            .delay(2000)
            .animate({width: 0, left: centerX}, {duration: 500, easing: "swing", complete: animateStart});
    }
    
    /*
     * パワー表示
     */
    function viewPower(num) {
        //.power-numを生成
        var powerNum = $("<div>"),
            powerNumCenterX = Math.floor(($(window).width() - powerNum.width()) / 2),
            powerNumCenterY  = Math.floor(($(window).height() - powerNum.height()) / 2);
        
        powerNum.html(Math.floor(num));
        powerNum.attr("class", "power-num");
        $("#contents").append(powerNum);
        
        //中央に配置
        powerNumZIndex++;
        powerNum.css({top: powerNumCenterY, "z-index" : powerNumZIndex});
        
        console.log("($(window).width() : " + $(window).width());
        console.log("powerNumCenterX : " + powerNumCenterX);
        console.log("($(window).height() : " + $(window).height());
        console.log("powerNumCenterY : " + powerNumCenterY);
        
        //アニメーション
        powerNum.animate({zoom: "50%", opacity: 1, "font-size": 200}, {duration: 200, easing: "swing"})
            .animate({opacity: 0}, {duration: 1000, complete: function () {this.remove(); }});
    }
    
    /**
     * ブラウザでのデバック用
     * URLの後ろに #power=100 とつけると擬似的にサーバーからの値をテストできる
     */
    function locationHashChanged() {
        
        var data = {},
            queryList = [],
            i = 0,
            element,
            paramName,
            paramValue,
            now,
            strData;
        
        if (location.hash) {
            queryList = location.hash.split('#')[1].split('&');
            
            for (i = 0; i < queryList.length; i++) {
                element = queryList[i].split('=');
                paramName = decodeURIComponent(element[0]);
                paramValue = decodeURIComponent(element[1]);
                data[paramName] = paramValue;
            }
        }
        
        //デバック
        now = new Date().toString();
        strData = JSON.stringify(data, undefined, '  ');
        console.log(now + '\n' + strData);
        
        if (data.power) {
            power = Number(data.power) + power;
            viewPower(data.power);
        }
    }
    
    init();
    
});