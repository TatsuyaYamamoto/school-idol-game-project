function preloadStart(callback) {
  var _queue;

  // ローディングアニメーション
  var q = new createjs.LoadQueue();
  q.setMaxConnections(6);

  q.loadManifest(manifest.load);
  q.addEventListener("complete", function () {
    var bitmap = new createjs.Bitmap(q.getResult("LOAD_IMG"));
    bitmap.scaleY = bitmap.scaleX = _screenScale;
    bitmap.x = _gameScrean.width * 0.5;
    bitmap.y = _gameScrean.height * 0.5;
    bitmap.regX = bitmap.image.width / 2;
    bitmap.regY = bitmap.image.height / 2;

    createjs.Tween.get(bitmap, { loop: true }).to({ rotation: 360 }, 1000);

    _gameStage.removeAllChildren();
    _gameStage.addChild(bitmap);

    _tickListener = createjs.Ticker.addEventListener("tick", function () {
      _gameStage.update();
    });
    load();
  });

  function load() {
    _queue = new createjs.LoadQueue();
    _queue.installPlugin(createjs.Sound);
    _queue.setMaxConnections(6);

    //マニフェストファイルを読み込む----------
    _queue.loadManifest(manifest.image);
    _queue.loadManifest(manifest.ss);
    _queue.loadManifest(manifest.sound);

    _queue.addEventListener("complete", function () {
      // すべてのコンテンツに設定を付与する
      for (var key in properties.ss) {
        var property = properties.ss[key];
        _ssObj[key] = getSpriteSheetContents(property);
      }
      for (var key in properties.sound) {
        var property = properties.sound[key];
        _soundObj[key] = getSoundContent(property);
      }
      for (var key in properties.text) {
        var property = properties.text[key];
        _textObj[key] = getTextContent(property);
      }
      _deferredCheckLogin
        .done(function () {
          for (var key in properties.asyncImage) {
            var property = properties.asyncImage[key];
            _imageObj[key] = getAsyncImageContent(property);
          }
        })
        .fail(function () {})
        .always(function () {
          for (var key in properties.image) {
            var property = properties.image[key];
            _imageObj[key] = getImageContent(property);
          }
          // ローディングアニメーション停止
          createjs.Ticker.removeEventListener("tick", _tickListener);
          // ロード完了後、コールバック
          callback();
        });
    });
  }

  //ロードしたコンテンツをセット------------------------------------------
  function getImageContent(property) {
    var image = new createjs.Bitmap(_queue.getResult(property.id));
    image.x = _gameScrean.width * property.ratioX;
    image.y = _gameScrean.height * property.ratioY;
    image.regX = image.image.width / 2;
    image.regY = image.image.height / 2;
    image.scaleY = image.scaleX = _screenScale * property.scale;
    image.alpha = property.alpha;
    return image;
  }

  function getAsyncImageContent(property) {
    var image = new createjs.Bitmap(property.url);
    image.x = _gameScrean.width * property.ratioX;
    image.y = _gameScrean.height * property.ratioY;
    // image.regX = image.width/2;
    // image.regY = image.height/2;
    image.scaleY = image.scaleX = _screenScale * property.scale;
    image.alpha = property.alpha;

    // _imageObj.TWITTER_ICON.regX = 0;
    // _imageObj.TWITTER_ICON.regY = 73;

    return image;
  }

  function getSpriteSheetContents(property) {
    var spriteSheet = new createjs.SpriteSheet({
      images: [_queue.getResult(property.id)],
      frames: property.frames,
      animations: property.animations,
    });
    var ss = new createjs.Sprite(spriteSheet, property.firstAnimation);
    ss.x = _gameScrean.width * property.ratioX;
    ss.y = _gameScrean.height * property.ratioY;
    ss.regX = property.frames.width / 2;
    ss.regY = property.frames.height / 2;
    ss.scaleY = ss.scaleX = _screenScale;

    return ss;
  }
  function getSoundContent(property) {
    var sound = createjs.Sound.createInstance(property.id);
    return sound;
  }
  function getTextContent(property) {
    var text = new createjs.Text();
    text.x = _gameScrean.width * property.ratioX;
    text.y = _gameScrean.height * property.ratioY;
    text.font = _gameScrean.width * property.size + "px " + property.family;
    text.color = property.color;
    text.textAlign = property.align;
    text.lineHeight = _gameScrean.width * property.lineHeight;
    text.text = property.text;

    return text;
  }
}
