# kassis_numbering

kassis numbering は、PostgreSQL と node.js を利用した WebAPI 型の採番アプリケーションです。

## 概要 / Description

* 識別子を送ると採番して JSON で返します。

## 必要なもの / Requirement

### サービスサーバ側

* node.js 0.12以上
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

## Usage

npm start で起動します。
標準の待受けポート番号は 3000 です。
環境変数 KASSIS_NUMBER_LISTEN_PORT にポート番号を設定することで出来ます。

例：ポート番号を8003にするとき。

```
$ KASSIS_NUMBER_LISTEN_PORT=8003 npm start
> kassis_numbering@0.1.0 start /opt/kassis_numbering
> node app.js
kassis numbering is Running on http://localhost:8003
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

## Contribution

pull request をお願いします。

## License

[MIT](https://raw.githubusercontent.com/nakamura-akifumi/kassis_numbering/master/LICENSE)

## Author

[Akifumi Nakamura](https://github.com/nakamura-akifumi)
