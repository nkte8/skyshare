このドキュメントは英語化されていません！
日本語のドキュメントを Wiki に整理次第、翻訳すること。

# Workflow の作成方法について

## Workflow 命名規則

Workflow の命名規則を以下に定めます。

- name: Actions の一覧に表示されます
  - 以下の接頭記号をつけます
    - 手動で実行する Workflow には`[Manual] `を付与します
    - github でのイベントを起点に起動する Workflow には`[OnEvent] `を付与します
    - 他の Workflow を起点に起動する Workflow には`[OnCall] `を付与します
  - 上記の接頭記号の後に、端的に Workflow の実行内容を示すこと
- run-name: Workflow の実行結果一覧に表示されます
  - `[OnEvent]`の Workflow については設定をしません
    - イベントに基づくデフォルト名称の Workflow が作成されます
  - `[OnCall]`の Workflow については以下を設定します
    - `(nameに指定した名称)`
      - `Hogehoge fugafuga`という表示になります
    - 他の Workflow を起点に起動する Workflow の`run-name`は、他の Workflow と異なり、呼び出し元に表示されます
      - そのため、表示を簡略化するため接頭文字は設定しません。
  - `[Manual]`の Workflow については以下を設定します
    - `[(nameに指定した名称)] ${{ github.ref_name }}`
      - `[Hogehoge fugafuga] <Workflowを実行したブランチ名>`という表示になります。

## ファイル命名規則

Workflow ファイル(`yaml`)の命名規則を以下に定めます。

- 名称はファイル名を見るだけで目的がわかるようにすること
- 接続詞は`_`を用いること
- 拡張子は[Offical Extensions](https://yaml.org/faq.html)の推奨に習い、`yaml`を用いること

## job 命名規則

Workflow 内の job の命名規則を以下に定めます。

- 名称は行っている操作を簡潔に示すこと
  - 一度に多くの趣旨の操作を行う場合、可能な限り分割すること
- 接続詞は`_`を用いること
- `動詞_目的語`の体裁を持つこと

## 権限

Workflow 内の権限の付与方法を以下に定めます。

- Workflow には必要最低限の権限を付与すること
- ファイルではなく、可能な限り job 単位に権限を付与すること

## 【要検討】Node を動かす場合の整理

現在は`auto-manage-pr-branches.yaml`の`change_base`のみが採用している。
今後別で node を使うという事になった際に、棲み分けができる構造の検討が必要
