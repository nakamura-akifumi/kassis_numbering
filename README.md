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

## Usage

npm start で起動します。

発注番号（識別子O）を新しい番号で採番する。

```
$ curl http://localhost:8002/num/identifier/O 
{"status":200,"last_value":"1109"}
```

存在しない識別を指定してエラーが返るのを確認する。

```
$ curl http://localhost:8002/num/identifier/INVALID_IDENTIFIER
{"status":404,"msg":"invalid identifier"}
```

## Contribution

pull request をお願いします。

## License

[MIT](https://raw.githubusercontent.com/nakamura-akifumi/kassis_numbering/master/LICENSE)

## Author

[Akifumi Nakamura](https://github.com/nakamura-akifumi)
