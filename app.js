//expressモジュールをインポート
var express = require('express');
var pg = require('pg');
var app = express();

var conString = "postgres://kassis@localhost/kassis_numbering";
var listen_port = 8002;

//ルーティング設定
app.get('/', function (req, res) {
  res.send('Hello Kassis Numbering\n');
});
app.get('/num/identifier/:identifier', function (req, res) {
  var identifier = req.params.identifier;
  var last_value = 0;
  var record_id = 0;

  pg.connect(conString, function(err, client, done) {
    if (err) {
      res.json({"status": 500, "msg": "database error."});
      return;
    }

    client.query("SELECT id as record_id, last_value from numbering where identifier = $1", [identifier], function(err, result) {
      if (result.rows.length == 0) {
        res.json({"status": 404, "msg": "invalid identifier"});
      } else {
        record_id = result.rows[0].record_id;
        last_value = parseInt(result.rows[0].last_value, 10) + 1;

        client.query('UPDATE numbering SET last_value = $2 WHERE id = $1', [record_id, last_value], function (err, result) {
          if (err) return rollback(client);
          //disconnect after successful commit
          //client.query('COMMIT', client.end.bind(client));
          done();

          //console.info("commit :" + last_value);
          res.json({"status": 200, 'last_value': "" + last_value + "" });
        });
      }
    });
  });
});

app.listen(listen_port, function() {
  console.log('kassis numbering is Running on http://localhost:'+listen_port);
})
