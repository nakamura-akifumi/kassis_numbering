# kassis_numbering

kassis numbering は、PostgreSQL と node.js を利用した WebAPI 型の採番アプリケーションです。

## Description


## Requirement

* DB: PostgreSQL 9.x

## Install

MacOS X の場合
brew install postgresql
brew install node

npm install pg
npm install koa
npm install koa-router

createuser kassis
createdb kassis_numbering

psql -U kassis kassis_numbering < sql/numbering.sql

サンプルデータ
psql -U kassis kassis_numbering < sql/sample.sql

## Usage

発注番号（識別子O）を新しい番号で採番する。
curl http://api.examples:port/num/identifier/O 

## Contribution


## License

[MIT](https://raw.githubusercontent.com/nakamura-akifumi/kassis_numbering/master/LICENSE)

## Author

[Akifumi Nakamura](https://github.com/nakamura-akifumi)




