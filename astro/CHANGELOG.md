# Skyshare 更新履歴

## 1.0.10

### Patch Changes

- Unexpected Errorの報告事例が相次ぐため、エラーハンドリングを強化しました。
  - これまでUnexpected Errorだった内容が、どのAPIが・どういった内容のエラーなのかをステータスメッセージとして詳細に報告するようになります。フィードバックのご協力に感謝します！
- Statusメッセージの表示を改善しました。
  - spanタグではなく、divタグに置き換え、改行した際も見た目が崩れないように設定しました。

## 1.0.9

### Patch Changes

- Changelogをページ化実施しました。
- Changeset導入によるバージョン管理を採用しました。Changelogが自動で作られて、便利。
- ログイン時、右上のログアウトボタンが押せなくなっていた不具合を修正しました。
  - 原因はDisableフラグを逆に指定していました。つまりログアウト時に有効になり、ログイン時に使えないという、矛盾した設定内容となっていました。
- 各ページの開発者アカウントのURLを修正しました。新handleは[nekono.dev](https://bsky.app/profile/nekono.dev)です。
- QAへ項目を追加しました。
- ログイン画面のhandleおよびpasswordフォームに初期値を追加し、入力内容をわかりやすくしました。
- その他tailwindCSS関連の設定値を整備しました。
  - 具体的には本Changelogページの整形のため、markdown-itによりHTML化、これに対してtailwindCSSがスタイルを適応できるよう、tailwind-variantsの一部のコードを[tailwindCSSの機能（adding-base-style）](https://tailwindcss.com/docs/plugins#adding-base-styles)に置き換えました。

## 1.0.8

### Patch Changes

- 末尾に改行コードを含むほとんどのメンション・リンクが投稿できない不具合を修正しました。
  - 原因は区切り文字で、1.0.7以前ではスペース文字を区切り文字として設定していましたが、改行文字は通常の文字種と同様に扱ってしまっていました。改行コードは明らかにURLとURLではない箇所を分割するため、区切り文字として判定するように修正しました。
  - 他にも区切り文字はあるかもしれませんが、いったんはBluesky公式が準じているだろう、上記の区切り文字（スペースまたは改行コード）を対象とします。発見ありがとうございました！[@tooon.bsky.social](https://bsky.app/profile/tooon.bsky.social)氏！

## 1.0.6

### Patch Changes

- 誤解を招く表現だったため、トップページの文言を少し変えました
- Q&Aページを作成しました。

## 1.0.5

### Patch Changes

- 日本語を含む文章にリンクまたはメンションを含む場合に、正常にリンクされない不具合を修正しました。
  - 原因はcreateRecordの際に、リンクを含む場合はRecordのfacetsとしてテキスト中のどこからどこまでを数値で指定してあげる必要があり、この数値の単位が文字ではなく、文字のバイト数を示していました。
  - これにより日本語は1文字3バイト換算にもかかわらず、処理上では1バイトとして扱っていたため、これを修正し、範囲ずれが起こらないようにしました。発見ありがとうございました！[@cpro.bsky.social](https://bsky.app/profile/cpro.bsky.social)氏！
- これより前までのPatch Changesは記録していませんでした...

## 1.0.0

### Major Changes

- 初リリース！よろしくお願いいたします。
