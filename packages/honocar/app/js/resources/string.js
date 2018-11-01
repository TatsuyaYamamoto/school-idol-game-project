export const Ids = {
  TAP_DISPLAY_INFO: "tap_display_info",
  //
  HOW_TO_PLAY_HONOKA: "how_to_play_honoka",
  HOW_TO_PLAY_KOTORI: "how_to_play_kotori",
  HOW_TO_PLAY_ERI: "how_to_play_eri",
  //
  PASS_COUNT: "pass_count",
  //
  LINK_ME: "link_me",
  LINK_SANZASHI: "link_sanzashi",
  LINK_SOUND_EFFECT: "link_sound_effect",
  LINK_ONJIN: "link_onjin",
  LINK_LOVELIVE: "link_lovelive",
  //
  LOGIN_SUCCESS: "login_success",
  LOGOUT_MESSAGE: "logout_message",
  REGISTER_SUCCESS: "register_success",
  UNAUTHORIZED: "unauthorized",
  UNEXPECTED_SERVER_ERROR: "unexpected_server_error",
  //
  ONLINE_DIALOG_PREPARE_TITLE: "online_dialog_prepare_title",
  ONLINE_DIALOG_PREPARE_TEXT: "online_dialog_prepare_text",
  ONLINE_DIALOG_PREPARE_CLIPBOARD: "online_dialog_prepare_clipboard",
  ONLINE_DIALOG_PREPARE_COPY_SUCCESS: "online_dialog_prepare_copy_success",
  ONLINE_DIALOG_READY_ROOM_TITLE: "online_dialog_ready_room_title",
  ONLINE_DIALOG_READY_ROOM_TEXT: "online_dialog_ready_room_text",
  ONLINE_DIALOG_READY_ONLINE_GAME_TITLE:
    "online_dialog_ready_online_game_title",
  ONLINE_DIALOG_READY_ONLINE_GAME_TEXT: "online_dialog_ready_online_game_text",
  ONLINE_DIALOG_REPLAY_CONFIRM_TITLE: "online_dialog_replay_confirm_title",
  ONLINE_DIALOG_REPLAY_CONFIRM_TEXT: "online_dialog_replay_confirm_text",
  ONLINE_DIALOG_REPLAY_WAITING_TEXT: "online_dialog_replay_waiting_text",
  ONLINE_DIALOG_DISCONNECTED_TITLE: "online_dialog_disconnected_title",
  ONLINE_DIALOG_DISCONNECTED_TEXT: "online_dialog_disconnected_text",
  ONLINE_DIALOG_TRY_CONNECT_TITLE: "online_dialog_try_connect_title",
  ONLINE_DIALOG_TRY_CONNECT_TEXT: "online_dialog_try_connect_text",

  ONLINE_DIALOG_ERROR_TITLE: "online_dialog_error_title",
  ONLINE_DIALOG_ERROR_NO_ROOM_TEXT: "online_dialog_error_no_room_text",
  ONLINE_DIALOG_ERROR_CAPACITY_OVER_TEXT:
    "online_dialog_error_capacity_over_text",
  ONLINE_DIALOG_ERROR_FAIL_CONNECT_P2P_TEXT:
    "online_dialog_error_fail_connect_p2p_text",

  ONLINE_INVITATION_TWEET_TEXT: "online_invitation_tweet_text",

  OPEN_EXTERNAL_SITE_INFO: "open_external_site_info",
  OPEN_RANKING_INFO: "open_ranking_info",
  OPEN_HOMEPAGE_INFO: "open_homepage_info"
};

export default {
  ja: {
    translation: {
      [Ids.TAP_DISPLAY_INFO]: "- Please tap on the display! -",

      [Ids.HOW_TO_PLAY_HONOKA]: `車道ど真ん中の穂乃果ちゃんを車が容赦なく襲う！

なかなか始まらないススメ→トゥモロウを尻目に
穂乃果ちゃんを助けてあげなくちゃ！
\r \r \r \r \r \r \r \r \r \r \r \r \r
LEFT, RIGHTボタン(キーボードの←→でも可！)
で、かわせ！ホノカチャン！

「私、やっぱりやる！やるったらやる！」`,
      [Ids.HOW_TO_PLAY_ERI]: `車道ど真ん中の生徒会長を車が容赦なく襲う！

なかなか始まらないススメ→トゥモロウを尻目に\rエリチカを助けてあげなくちゃ！
\r \r \r \r \r \r \r \r \r \r \r \r \r
LEFT, RIGHTボタン(キーボードの←→でも可！)
で、かしこく！かわせ！エリーチカ！！(KKE)

「生徒会の許可ぁ？認められないチカ！」`,

      [Ids.HOW_TO_PLAY_KOTORI]: `車道ど真ん中のミナリンスキーを車が容赦なく襲う！

なかなか始まらないススメ→トゥモロウを尻目に\rこと...ミナリンスキーを助けるちゅん！
\r \r \r \r \r \r \r \r \r \r \r \r \r
LEFT, RIGHTボタン(キーボードの←→でも可！)
で、逃げずにかわせ！ことりちゅん！

「ことり? What? ドナタディスカ～??」`,

      [Ids.PASS_COUNT]: "よけたー {{ count }} 台",

      [Ids.LINK_ME]:
        "プログラム、音楽、思いつき：T28\rhttps://twitter.com/t28_tatsuya",
      [Ids.LINK_SANZASHI]:
        "イラスト：さんざし\rhttps://twitter.com/xxsanzashixx",
      [Ids.LINK_SOUND_EFFECT]:
        "効果音：効果音ラボ 樣\rhttp://soundeffect-lab.info/",
      [Ids.LINK_ONJIN]: "効果音：On-Jin ～音人～ 樣\rhttp://on-jin.com/",
      [Ids.LINK_LOVELIVE]:
        "プロジェクトラブライブ！\rhttp://www.lovelive-anime.jp",

      [Ids.LOGIN_SUCCESS]: "ランキングシステム ログイン中！",
      [Ids.LOGOUT_MESSAGE]:
        "ログアウトします。ランキング登録はログイン中のみ有効です。",
      [Ids.REGISTER_SUCCESS]: "ランキングシステム　通信完了！",
      [Ids.UNAUTHORIZED]:
        "ログインセッションが切れてしまいました...再ログインして下さい。",
      [Ids.UNEXPECTED_SERVER_ERROR]:
        "ランキングシステムへの接続に失敗しました...",

      [Ids.ONLINE_DIALOG_PREPARE_TITLE]: "ルームを作成しました",
      [Ids.ONLINE_DIALOG_PREPARE_TEXT]: `招待用URLからゲームにアクセスすることで、あなたと対戦が行えます。<br/>
このダイアログを閉じてもルームは削除されないため、ひとりモードで遊びながら待ちましょう。（・８・）<br/>
<br/>
ルームを閉じる時はページをリロードしてください。`,
      [Ids.ONLINE_DIALOG_PREPARE_CLIPBOARD]: "Copy URL",
      [Ids.ONLINE_DIALOG_PREPARE_COPY_SUCCESS]: "コピーしました!",

      [Ids.ONLINE_DIALOG_READY_ROOM_TITLE]: "メンバー確定",
      [Ids.ONLINE_DIALOG_READY_ROOM_TEXT]: "オンライン対戦の準備しています...",

      [Ids.ONLINE_DIALOG_READY_ONLINE_GAME_TITLE]: "準備完了！",
      [Ids.ONLINE_DIALOG_READY_ONLINE_GAME_TEXT]:
        "{{ timeLeft }}秒後にオンライン対戦を開始します！",

      [Ids.ONLINE_DIALOG_REPLAY_CONFIRM_TITLE]: "もう一度遊びますか？",
      [Ids.ONLINE_DIALOG_REPLAY_CONFIRM_TEXT]: "対戦相手が再戦を求めています！",

      [Ids.ONLINE_DIALOG_REPLAY_WAITING_TEXT]: "対戦相手の入力待っています...",

      [Ids.ONLINE_DIALOG_DISCONNECTED_TITLE]: "ゲーム終了",
      [Ids.ONLINE_DIALOG_DISCONNECTED_TEXT]:
        "通信相手の接続が切れてしまいました。Topに戻ります。",

      [Ids.ONLINE_DIALOG_TRY_CONNECT_TITLE]: "接続中",
      [Ids.ONLINE_DIALOG_TRY_CONNECT_TEXT]:
        "オンライン対戦用のサーバーに接続しています...",

      [Ids.ONLINE_DIALOG_ERROR_TITLE]: "えらー",
      [Ids.ONLINE_DIALOG_ERROR_NO_ROOM_TEXT]: `ルームが見つかりませんでした。メンバーがいなくなったため削除された、または作成者がルームを閉じてしまった可能性があります。<br/>
ルーム名: {{ roomName }}`,
      [Ids.ONLINE_DIALOG_ERROR_CAPACITY_OVER_TEXT]: `ルームは定員のため、入ることが出来ませんでした。<br/>
ルーム名: {{ roomName }}`,

      [Ids.ONLINE_INVITATION_TWEET_TEXT]: `ほのCar！で対戦しませんか？URLをタップすると、オンライン対戦が始まります！`,

      [Ids.OPEN_EXTERNAL_SITE_INFO]: "外部サイト({{ domain }})を開きます！",
      [Ids.OPEN_RANKING_INFO]: "ランキングページを開きます！",
      [Ids.OPEN_HOMEPAGE_INFO]: "ホームページへ移動します！"
    }
  }
};
