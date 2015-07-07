# kassis_numbering

kassis numbering は、PostgreSQL と node.js を利用した WebAPI 型の採番アプリケーションです。

## 概要 / Description

* 識別子を送ると採番して JSON で返します。

## 必要なもの / Requirement

### サービスサーバ側

* node.js 0.10以上 (v0.10.36とv0.12.5で確認しています）
* PostgreSQL 9.1 以上

### クライアント側

* HTTPで通信出来れば問いません。

## インストール / Install

### ミドルウェアのインストール

* MacOS X の場合

```
$ brew install postgresql
$ brew install node
```

* Cent OS 7 の場合

```
$ sudo yum install epel-release
$ sudo yum install nodejs npm
$ wget http://yum.postgresql.org/9.4/redhat/rhel-7-x86_64/pgdg-centos94-9.4-1.noarch.rpm
$ sudo rpm -ivh pgdg-centos94-9.4-1.noarch.rpm
$ sudo yum -y install postgresql94-server postgresql94-devel postgresql94-contrib
$ sudo /usr/pgsql-9.4/bin/postgresql94-setup initdb
$ sudo vi /var/lib/pgsql/9.4/data/pg_hba.conf
$ systemctl start postgresql-9.4
```

### データベースの作成

```
$ createuser kassis
$ createdb -O kassis kassis_numbering
```

### アプリケーションのダウンロードとインストール

```
$ git clone https://github.com/nakamura-akifumi/kassis_numbering.git
$ cd kassis_numbering
$ npm install
$ psql -U kassis kassis_numbering < sql/numbering.sql
```

サンプルデータが必要な場合は以下のコマンドも実行してください。

``
$ psql -U kassis kassis_numbering < sql/sample.sql
``

## 使い方 / Usage

### 使い方

npm start で起動します。
標準の待受けポート番号は 3000 です。
環境変数 KASSIS_NUMBER_LISTEN_PORT にポート番号を設定することで出来ます。
環境変数 KASSIS_NUMBER_DATABASE_URL に接続データベース名を設定することも可能です。

例：ポート番号を8003にするとき。

```
$ KASSIS_NUMBER_LISTEN_PORT=8003 npm start
> kassis_numbering@0.1.0 start /opt/kassis_numbering
> node app.js
kassis numbering is Running on http://localhost:8003
```

例：接続データベース名を変更するとき。（接続ユーザ nakamura 、データベース名 kassis_numbering）

```
$ KASSIS_NUMBER_DATABASE_URL="postgres://nakamura@localhost/kassis_numbering" npm start
```

次のインターフェイスを備えています。

|Action|URL|Method|
|:-----|:--|:----:|
|LIST  | /inentifiers | GET |
|CREATE| /identifier | POST |
|READ  | /identifier/:id | GET |
|UPDATE| /identifier/:id | PUT |
|DELETE| /identifier/:id |DELETE |
|NUMBERING| /numbering/:IDENTIFIER | GET |


発注番号（識別子O）を新しい番号で採番する。

```
$ curl http://localhost:3000/numbering/O 
{"status":200,"last_value":"1109"}
```

存在しない識別を指定してエラーが返るのを確認する。

```
$ curl http://localhost:3000/numbering/INVALID_IDENTIFIER
{"status":404,"msg":"invalid identifier"}
```

新しい採番を作成する。

```
curl --data "identifier=J&display_name=test&prefix=&suffix=&is_padding=0&padding_length=&padding_character=&last_value=0" \
  http://localhost:3000/identifier
```

### NUMBERING テーブルの設定

numbering テーブルに設定値を保存します。

|カラム|内容|備考|
|:-----|:--|:----:|
|id  | シリアル番号 |  |
|identifier  | 識別子を指定します。APIからアクセスするときのキーにも使います。 | 文字最大16文字 |
|display_name  | 表示用ラベル。人間が判断するためのメモで利用します。 | 文字最大64文字 |
|prefix  | プレフィックスを指定します。指定がある場合は採番値の前に設定されます。 | 文字最大16文字 |
|suffix  | サフィックスを指定します。指定がある場合は採番値の後に設定されます。 | 文字最大16文字 |
|is_padding  | 指定の桁数で文字を埋めるかどうかを指定します。 | 0：埋めない 1:埋める |
|padding_length  | 埋める場合の採番値と合わせた桁数を指定します。 | 数値のみ |
|padding_character  | 埋める場合の文字を指定します。 | 文字最大16文字 |
|check_digit_rule  | 最後にチェックデジットを付加する場合に指定します。 | v0.3では未実装です。0:未使用 1:モジュラス10/ウェイト3 2:モジュラス10/ウェイト2 |
|last_value  | 最後に採番した番号が設定されています。 | 数値のみ |

## Contribution

pull request をお願いします。

## License

[MIT](https://raw.githubusercontent.com/nakamura-akifumi/kassis_numbering/master/LICENSE)

## Author

[Akifumi Nakamura](https://github.com/nakamura-akifumi)
