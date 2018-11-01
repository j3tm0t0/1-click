# AWS IoT 1-Click サービスから LINE に連携するためのサンプル

Runtime は Python 3.6 です

## 準備

- LINE 上の Bot の準備
- AWS 1-Click の設定

## LINE 上で Bot を準備する

LINE のアカウントが必要です。開設ください。

その後 [LINE Developers](https://developers.line.me/console/) にログインし、設定をしていきます。

注意: その他 [LINE@ MANAGER](https://admin-official.line.me/) という管理画面がありますが、どちらも LINE のアカウントでログインすることができてしまいます。LINE@ MANAGER で「LINE@アカウントがありません。」と表示された場合は [LINE Developers Console](https://developers.line.me/console/) に進んでください。

### LINE Developers の準備

1. 新規プロバイダー作成
  - プロバイダー名: （LINE アプリ上で確認できる表示がありませんでした。どこに表示されるんだろ？）
2. "Messaging API" のチャネルを作成する
  - アプリアイコン画像: 友達一覧画面での画像になります
  - アプリ名: 友達名になります
  - アプリ説明: （LINE アプリ上で確認できる表示がありませんでした。どこに表示されるんだろ？）
  - プラン: Developer Trial
  - 大業種、小業種: （LINE アプリ上で確認できる表示がありませんでした。どこに表示されるんだろ？）
  - メールアドレス: LINE 運営側からの重要なお知らせ等が届くようです。利用者には表示されません。

これで作成されます。また作成後は LINE@ MANAGER のアカウント一覧にも表示されます。

続いて、あらたに作成されたチャネルを選択し、チャネル基本設定を表示します。ここではアクセストークンの発行やとチャネルIDの確認を行います。

- アクセストークン（ロングターム） "再発行" を押します。
- ダイアログが表示されます。"失効までの時間" は 0 時間後でOKです。
- 発行された **アクセストークン（ロングターム）を控えておきます。**
- その他の項目で **Your user ID を控えておきます。**

最後に QR コードを LINE アプリで読み込み、この Bot と友達になりましょう。

以上で準備は完了です。

#### コラム

アクセストークン（ロングターム）を再発行する際、「失効までの時間」を聞かれます。この意味は「既に発行済みのアクセストークン（ロングターム）の失効までに要する時間」という意味です。ですので初回発行においては意味を成さないので 0 時間後で OK なのです。このダイアログ、ぱっと見ると「今から発行しようとしているアクセストークンの失効期限」のように見えるのでややこしいですね。。。

### Messaging API

Bot からのプッシュメッセージは `POST https://api.line.me/v2/bot/message/push` API を使います
詳細は https://developers.line.me/ja/reference/messaging-api/ の "プッシュメッセージを送る" で確認できます。

curl コマンドで送る際に必要なパラメータは以下の通りです

- `{channel access token}` ← 先ほど発行した "アクセストークン（ロングターム）"
- `to` ← 先ほど控えた "Your user ID"

#### curl で確認

```
$ curl -v -X POST https://api.line.me/v2/bot/message/push \
-H 'Content-Type:application/json' \
-H 'Authorization: Bearer jnjGZp8SM1xiUqdvvuhDI2...4+6AdB04t89/1O/w1cDnyilFU=' \
-d '{
    "to": "U8106723.............8c1261a",
    "messages":[
        {"type":"text", "text":"Hello, world1"}
    ]
}'
```

### トラブルシュートやTIPS

- Developer Trial プランにできない: LINE@ MANAGER 上で作った Bot からは Developer Trial にできません。LINE Developers Console から Bot を作ってください。
- POST 時に HTTP 400 が返ってくる場合: 誰一人も Bot と友達になっていないと HTTP 400 になります。誰か友達になってください！

#### Bot の削除

LINE@ MANAGER で削除できます。復活はできません。人生はやり直しが難しいですが、Botは気軽に作り直せます。

#### LINE アプリ上から Bot を削除

「LINE 友達 削除」でググってください

## AWS 1-Click の設定

- [AWS IoT 1-Click のコンソール](https://ap-northeast-1.console.aws.amazon.com/iot1click/home)を開きます。
- デバイスを登録します
- [プロジェクトを新規作成します](https://ap-northeast-1.console.aws.amazon.com/iot1click/home?region=ap-northeast-1#/create/project)
  - プロジェクト名 : `LINE` (任意)
- プロジェクトのプレイスメントのテンプレートの定義 をします。
  - デバイステンプレート定義
    - デバイステンプレート名: `LINE` (任意)
    - アクション: **Lambda 関数の選択**
    - AWS リージョン: (Lambda 関数のデプロイ先リージョンを指定)
    - Lambda 関数: `1-click_line-bot_py` (もしくは別の名前)
 - プレイスメントの属性
   - このテンプレート全体で共通する属性の設定となります (後述通り、プレイスメント毎に上書きすることも出来ます)
   - **token と to は必須項目です、準備でメモしておいたものを入れます**
      - _token_ : アクセストークン（ロングターム）
      - _to_ : Your user ID
- プレイスメントを作成します
  - プレイスメント作成時はテンプレートの値が引き継がれていますが、ここでオーバーライドすることも出来ます。例えば、異なる Your user ID に送信したいといった場合です。

## LINE 側の設定

LINE Developers の準備でも解説しましたが、この Bot と友達になっておく必要があります。さもないと HTTP 400 エラーという事になりますのでご注意ください。

私は LINE の友達が少ないので開発しやすいです。

### 実行結果

このようになります

<img src="https://docs.google.com/drawings/d/e/2PACX-1vScA8oifcpqfxXn8jatie9pUB95H6Eq-g4Isa6_tLYNJ58XIDi7FpdApRpZX03JiNjNRyS8lF-oclYi/pub?w=238&amp;h=516" alt="1-click_apex_document / line-bot_py-result">

EoT
