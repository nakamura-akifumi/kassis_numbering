# kassis_numbering

kassis numbering は、PostgreSQL と node.js を利用した WebAPI 型の採番アプリケーションです。

## Description


## Requirement

データベースに PostgreSQL 9.x を使います。

## Install

ミドルウェアのインストール

MacOS X の場合
brew install postgresql
brew install node

CentOS 7 の場合

データベースの作成

$ createuser kassis
$ createdb kassis_numbering

アプリケーションのダウンロードとインストール

$ git clone https://github.com/nakamura-akifumi/kassis_numbering.git
$ cd kassis_numbering
$ npm install
$ psql -U kassis kassis_numbering < sql/numbering.sql

サンプルデータが必要な場合は以下のコマンドを実行してください。
$ psql -U kassis kassis_numbering < sql/sample.sql

## Usage

npm start で起動します。

発注番号（識別子O）を新しい番号で採番する。
$ curl http://localhost:8002/num/identifier/O 
{"status":200,"last_value":"1109"}

存在しない識別を指定してエラーが返るのを確認する。
$ curl http://localhost:8002/num/identifier/INVALID_IDENTIFIER
{"status":404,"msg":"invalid identifier"}

## Contribution

pull request をお願いします。

## License

[MIT](https://raw.githubusercontent.com/nakamura-akifumi/kassis_numbering/master/LICENSE)

## Author

[Akifumi Nakamura](https://github.com/nakamura-akifumi)




