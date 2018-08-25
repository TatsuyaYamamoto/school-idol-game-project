//変数宣言----------------------------------------
var gameStage;
var gameScrean;
var gameScreenScale;

var gameFrame;
var passCarCount;
var gameScore;
var tickListener;

var queue;
var loginCheckPromise;
var isSoundMute = false;

var playCharacter = "honoka";
//honoka or erichi
var player;
//キャラクターオブジェクトを格納する
var car;

var deferredCheckLogin;
var isLogin = false;

var imageObj = {};
var ssObj = {};
var soundObj = {};
var textObj = {};
var user = {
  id: "",
  name: ""
};

var deferredCheckLogin;

//初期化----------------------------------------

var TWITTER_ICON_URL;
var screen_name;
//テキスト

var TEXT_HOW_TO;
var TEXT_GAME_COUNT;
var TEXT_START;

var TEXT_RANKING;

var TEXT_LINK_LOVELIVE;
var TEXT_LINK_ME;
var TEXT_LINK_SAN;
var TEXT_LINK_1;
var TEXT_LINK_2;

var text_how_to =
  "車道ど真ん中の穂乃果ちゃんを車が容赦なく襲う！\r \rなかなか始まらないススメ→トゥモロウを尻目に\r穂乃果ちゃんを助けてあげなくちゃ！\r \r \r \r \r \r \r \r \r \r \r \r \r \r \rLEFT, RIGHTボタン(キーボードの←→でも可！)\rで、かわせ！ホノカチャン！\r \r「私、やっぱりやる！やるったらやる！」";
var text_how_to_E =
  "車道ど真ん中の生徒会長を車が容赦なく襲う！\r \rなかなか始まらないススメ→トゥモロウを尻目に\rエリチカを助けてあげなくちゃ！\r \r \r \r \r \r \r \r \r \r \r \r \r \r \rLEFT, RIGHTボタン(キーボードの←→でも可！)\rで、かしこく！かわせ！エリーチカ！！(KKE)\r \r「生徒会の許可ぁ？認められないチカ！」";
var text_game_count_L = "よけたー : ";
var text_game_count_R = "台";

//ゲームスクリーンサイズ初期化用-----------------------
function initGameScreenScale() {
  if (
    window.innerHeight / window.innerWidth <
    config.system.gamescrean.height / config.system.gamescrean.width
  ) {
    gameScreenScale = window.innerHeight / config.system.gamescrean.height;
  } else {
    gameScreenScale = window.innerWidth / config.system.gamescrean.width;
  }

  gameScrean.height = config.system.gamescrean.height * gameScreenScale;
  gameScrean.width = config.system.gamescrean.width * gameScreenScale;
}

// tweet文言----------------
function getTweetText() {
  var tweet_text;

  switch (playCharacter) {
    case "honoka":
      if (gameScore == 0) {
        tweet_text =
          "穂乃果「いやー、今日もパンがうまいっ！」海未「また運動もせずにそんなものを食べて！」";
      } else if (gameScore < 100) {
        tweet_text =
          "穂乃果「ことりちゃーん！穂乃果、" +
          gameScore +
          "台も車を避けたのに、海未ちゃんちっとも褒めてくれないよー！」";
      } else if (gameScore >= 100) {
        tweet_text =
          "海未「なにやっていたんですか！！どれだけ避けたと思っているんですか...」穂乃果「" +
          gameScore +
          "台！」";
      }
      break;
    case "erichi":
      if (gameScore == 0) {
        tweet_text = "(車なんて避けてないで)エリチカ、おうちにかえる!!!";
      } else if (gameScore < 100) {
        tweet_text =
          gameScore +
          "台よ...なんとか避けなくちゃいけないんだから、しょうがないじゃないチカ！";
      } else if (gameScore >= 100) {
        tweet_text = gameScore + "台！ハラショー！";
      }
      break;
  }
  return tweet_text;
}

// ランキング登録-------------
function registration() {
  $.ajax({
    type: "POST",
    url: config.api.score,
    xhrFields: {
      withCredentials: true
    },
    contentType: "application/json",
    data: JSON.stringify({
      point: gameScore
    })
  })
    .done(function(data, status, xhr) {
      alertify.log("ランキングシステム　通信完了！", "success", 3000);
    })
    .fail(function() {
      if (textStatus == 401) {
        alertify.log(
          "ログインセッションが切れてしまいました...再ログインして下さい。",
          "error",
          3000
        );
      } else {
        alertify.log(
          "ランキングシステムへの接続に失敗しました...",
          "error",
          3000
        );
      }
    });
}

// プレイログ登録-------------
function postPlayLog() {
  $.ajax({
    type: "POST",
    url: config.api.playlog,
    xhrFields: {
      withCredentials: true
    },
    contentType: "application/json",
    data: JSON.stringify({
      point: gameScore
    })
  }).done(function(data, status, xhr) {});
}

// システムへログイン-------------

function requestCheckingLogging() {
  var deferred = $.Deferred();

  var ajax = $.ajax({
    type: "GET",
    url: config.api.user,
    xhrFields: {
      withCredentials: true
    }
  });

  $.when(ajax)
    .done(function(data) {
      alertify.log("ランキングシステム ログイン中！", "success", 3000);

      user.id = data.user_id;
      user.name = data.user_name;
      properties.asyncImage.TWITTER_ICON.url = data.icon_url;

      isLogin = true;
      deferred.resolve();
    })
    .fail(function() {
      // 未ログインの場合は通知なし
      isLogin = false;
      deferred.reject();
    });

  return deferred.promise();
}

//イベントリスナー登録--------------------------------

function addAllEventListener() {
  imageObj.BUTTON_RIGHT.addEventListener("mousedown", clickButtonRight);

  imageObj.BUTTON_LEFT.addEventListener("mousedown", clickButtonLeft);

  imageObj.BUTTON_START.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", tickListener);
    soundObj.SOUND_ZENKAI.stop();
    soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
    gameState();
  });
  imageObj.BUTTON_HOW_TO.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", tickListener);
    soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
    howToPlayState();
  });
  imageObj.BUTTON_RANKING.addEventListener("mousedown", function() {
    window.location.href =
      "http://games.sokontokoro-factory.net/ranking/?game=honocar";
  });

  imageObj.BUTTON_CREDIT.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", tickListener);
    soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
    creditState();
  });

  imageObj.BUTTON_BACK_TOP.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", tickListener);
    soundObj.SOUND_BACK.play("none", 0, 0, 0, 1, 0);
    menuState();
  });

  imageObj.BUTTON_BACK_TOP_FROM_HOW_TO.addEventListener(
    "mousedown",
    function() {
      createjs.Tween.removeTweens(player.img);
      soundObj.SOUND_BACK.play("none", 0, 0, 0, 1, 0);
      createjs.Ticker.removeEventListener("tick", tickListener);
      menuState();
    }
  );

  imageObj.BUTTON_BACK_TOP_FROM_CREDIT.addEventListener(
    "mousedown",
    function() {
      soundObj.SOUND_BACK.play("none", 0, 0, 0, 1, 0);
      menuState();
    }
  );

  imageObj.BUTTON_BACK_TOP_FROM_RANKING.addEventListener(
    "mousedown",
    function() {
      soundObj.SOUND_BACK.play("none", 0, 0, 0, 1, 0);
      $("#rankingName").hide();
      menuState();
    }
  );

  imageObj.BUTTON_RESTART.addEventListener("mousedown", function() {
    createjs.Ticker.removeEventListener("tick", tickListener);
    soundObj.SOUND_BACK.play("none", 0, 0, 0, 1, 0);
    gameState();
  });

  ssObj.BUTTON_SOUND_SS.addEventListener("mousedown", function() {
    soundObj.SOUND_TURN_SWITCH.play("none", 0, 0, 0, 1, 0);
    if (isSoundMute) {
      ssObj.BUTTON_SOUND_SS.gotoAndPlay("on");
      soundTurnOn();
    } else {
      ssObj.BUTTON_SOUND_SS.gotoAndPlay("off");
      soundTurnOff();
    }
  });

  imageObj.BUTTON_TWITTER_LOGIN.addEventListener("mousedown", function() {
    window.location.href = config.api.login;
  });
  imageObj.BUTTON_TWITTER_LOGOUT.addEventListener("mousedown", function() {
    soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
    alertify.confirm(
      "ログアウトします。ランキング登録はログイン中のみ有効です。",
      function(result) {
        if (result) {
          soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);
          window.location.href = config.api.logout + "?redirect=honocar";
        } else {
          soundObj.SOUND_BACK.play("none", 0, 0, 0, 1, 0);
        }
      }
    );
  });

  imageObj.BUTTON_TWITTER_TOP.addEventListener("mousedown", function() {
    window.location.href = config.link.t28_twitter;
  });

  ssObj.BUTTON_TWITTER_GAMEOVER_SS.addEventListener("mousedown", function() {
    window.location.href =
      "https://twitter.com/intent/tweet" +
      "?hashtags=ほのCar!+%23そこんところ工房" +
      "&text=" +
      getTweetText() +
      "&url=http://games.sokontokoro-factory.net/honocar/";
  });
  ssObj.BUTTON_CHANGE_CHARA.addEventListener("mousedown", function() {
    soundObj.SOUND_OK.play("none", 0, 0, 0, 1, 0);

    switch (playCharacter) {
      case "honoka":
        playCharacter = "erichi";
        break;
      case "erichi":
        playCharacter = "honoka";
        break;
    }

    createjs.Ticker.removeEventListener("tick", tickListener);
    topState();
  });
  textObj.TEXT_LINK_1.addEventListener("mousedown", function() {
    window.location.href = config.link.soundeffect;
  });
  textObj.TEXT_LINK_2.addEventListener("mousedown", function() {
    window.location.href = config.link.on_jin;
  });
  textObj.TEXT_LINK_ME.addEventListener("mousedown", function() {
    window.location.href = config.link.sokontokoro;
  });
  textObj.TEXT_LINK_SAN.addEventListener("mousedown", function() {
    window.location.href = config.link.sanzashi;
  });
  window.addEventListener("blur", function() {
    soundTurnOff();
    createjs.Ticker.setPaused(true);
  });
  window.addEventListener("focus", function() {
    soundTurnOn();
    createjs.Ticker.setPaused(false);
  });
}
