# Firebase

### firebase functions config for api package

_dev_

```shell script
$ firebase functions:config:get --project school-idol-game-development
```

```shell script
$ KEY=twitter ; firebase functions:config:set $KEY="$(cat .runtimeconfig.json | jq ".$KEY")" --project school-idol-game-development
$ KEY=skyway  ; firebase functions:config:set $KEY="$(cat .runtimeconfig.json | jq ".$KEY")" --project school-idol-game-development
$ KEY=slack   ; firebase functions:config:set $KEY="$(cat .runtimeconfig.json | jq ".$KEY")" --project school-idol-game-development
```

_pro_

```shell script
$ firebase functions:config:get --project school-idol-game-production
```

```shell script
$ KEY=twitter ; firebase functions:config:set $KEY="$(cat .runtimeconfig.pro.json | jq ".$KEY")" --project school-idol-game-production
$ KEY=skyway  ; firebase functions:config:set $KEY="$(cat .runtimeconfig.pro.json | jq ".$KEY")" --project school-idol-game-production
$ KEY=slack   ; firebase functions:config:set $KEY="$(cat .runtimeconfig.pro.json | jq ".$KEY")" --project school-idol-game-production
```

_local_

[Ref.](https://firebase.google.com/docs/functions/local-shell?hl=ja)

```bash
// "project root"に設置する!
// 理由: https://github.com/firebase/firebase-functions/blob/edcb35dd042cf350d50dfb618d60d0a5686e06fd/src/config.ts#L72
$ firebase functions:config:get > .runtimeconfig.json
```
