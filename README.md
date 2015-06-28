# kassis_numbering

kassis numbering は、PostgreSQL と node.jsを利用した WebAPI 型の採番アプリケーションです。

## Description


## Requirement

* DB: PostgreSQL 

## Install

MacOS X の場合
brew install postgresql
brew install node

npm install pg

mysql -u root 
CREATE DATABASE kassis_numbering DEFAULT CHARACTER SET utf8;
GRANT ALL PRIVILEGES ON kassis_numbering.* TO kassis@localhost IDENTIFIED BY 'kassis' WITH GRANT OPTION;
FLUSH PRIVILEGES;

mysql -u kassis -pkassis kassis_numbering < sql/numbering.sql



## Usage


## Contribution


## License

[MIT](https://raw.githubusercontent.com/nakamura-akifumi/kassis_orange/master/LICENSE)

## Author

[Akifumi Nakamura](https://github.com/nakamura-akifumi)




