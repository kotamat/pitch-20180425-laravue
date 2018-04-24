# AWSで構築するNuxt.jsのインフラ構築3選

---

## 自己紹介

- 株式会社SCOUTER CTO
- @kotamat
- 🚲

---

## SCOUTERとは

![会社紹介](assets/img/scouter-1.png)

---

## NuxtMeetup

![NuxtMeetup](assets/img/nuxt-meetup.png)

- Nuxt.jsに関するMeetup
- お酒飲みながらLTする会
- 次回は5/23に開催@メルペイ
- 参加者は110名ほど

---

## AWSで構築するNuxt.jsのインフラ構築

- 今Nuxt.jsが熱い！
- Nuxt.jsの良さの記事は多いけど、インフラの話は少ない
- インフラ工夫したので、紹介します
- ちゃんとLaravelもいれた構成も説明するよ 😅

---

## トピック

- Laravel + Nuxt generate
- Wordpress + Nuxt ssr
- Nuxt SSR + Express

---

## Laravel + Nuxt generate

+++

### 基本スタンス

- LaravelとNuxtを一緒のリポジトリに置く
- nuxt.config.jsの設定を調整
- TravisでNuxtGenerateする
- dist込みの全体をCodedeployで設置
- Nginxでリバプロする
- (補足)ビルド時にチェックしておくべきポイント

+++

### LaravelとNuxtを一緒のリポジトリに置く

```bash
app/
bootstrap/
config/
...
client/←追加
```

+++

### nuxt.config.jsの設定を調整

+++?code=src/laravel/nuxt.config.js&lang=js

hogehoge
`client/` を認識するように設定を追加

+++

### TravisでNuxtGenerateする

+++code?.travis.yml&lang=yml

依存パッケージのinstall
先にgenerate
不要なディレクトリを除いてzip化
S3に上げる

+++

### dist込みの全体をCodedeployで設置

+++code?appspec.yml&lang=yml

普通に設置する

+++

### Nginxでリバプロする

ディレクトリで分岐
Generateしているファイルは普通にtry_filesで引っかかる
/apiになっているものはLaravel側を参照しにいく

+++

### (補足)ビルド時にチェックしておくべきポイント

`nuxt` コマンドで生成するときと`nuxt generate`する時で、ビルドのフローが異なっているので、
CI側では`nuxt generate`が失敗しないこともチェックする必要がある

---

## Wordpress + nuxt ssr

- WordpressAPIを使用。
- 大体この手のアプリはSEO対策が必須になるのでSSRモードにする
- プロセス監視にはforeverを使用

+++

### サマリ

- Nuxtのみのリポジトリを設置する
- Travisでnuxt build
- Codedeployで設置
- foreverのプロセスを切る

+++

### Nuxtのみのリポジトリを設置する

- Wordpress APIを使用
- Specが決まってるので、Wordpressと共存する必要がない
- 普通に単一リポジトリにVue cliでインストール

+++?code=nuxt.config.js&lang=js

- axios moduleでbaseUrlをwpに設定

+++

### Travisでnuxt build

+++code?.travis.yml&lang=yml

依存パッケージのinstall
不要なディレクトリを除いてzip化
S3に上げる

+++

### Codedeployで設置

+++code?appspec.yml&lang=yml

普通に設置する

+++

### foreverの対象プロセスを切って再起動

- ファイルを上げただけでは前のプロセスが残ってるので、デプロイにはならない
- foreverはプロセスを監視し、切れたタイミングで再起動を自動で行ってくれる
- 何か知らの方法でプロセスを切るか、`forever restart`で再起動をすることで、デプロイが完了する

+++code?appspec.yml&lang=yml

起動設定ファイルを設置

+++code?application-start.sh&lang=bash

再起動のスクリプトを記述

+++

---

## expressで構築する場合

- 独自のSlack通知やファイルアップロード等サーバーが必要な場合はExpressを使う
- デフォルトの`nuxt` `nuxt start`は使えなくなるので独自実装が必要
- やり方はNuxt.jsのドキュメントに記載されている [ドキュメントはこちら](https://nuxtjs.org/examples/auth-routes#using-express-and-sessions)

+++

### サマリ

- サーバーサイド用のjsファイルを作成
- developmentビルドとprodビルドで分ける
- 起動設定を対象jsファイルに向ける

### サーバーサイド用のjsファイルを作成

---?code=server.js&lang=js

nuxtをrequire
expressもrequire
expressの設定を記述
postなどのエンドポイントを記述
prod判定をして
developmentであれば、buildもおこなう
start用の設定を注入
ポートを開ける

### 起動設定を対象jsファイルに向ける

+++code?application-start.sh&lang=bash

再起動のスクリプトをserver.jsに向ける

## まとめ

- Nuxt.jsはいろんなパターンの配信方法がある
- 各々のインフラ構成を知っておけば、武器が増える
- みんなNuxt.js使っていこう！
- Laravelもね
