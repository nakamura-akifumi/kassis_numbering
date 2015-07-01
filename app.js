var logger = require('koa-logger');
var app = require('koa')();
var router = require('koa-router')();
var Q = require('q');
var pg = require('pg');

var conString = "postgres://kassis@localhost/kassis_numbering";
var listen_port = 8002;

app.use(logger());

app.use(function *(next){
  var start = new Date;

  try {
    yield* next;
  } catch (err) {
    this.status = 500;
    this.message = err.message;
  }

  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
  this.set('X-Response-Time', ms + 'ms');
});

router.get('/', hello);
router.get('/num/identifier/:identifier', numbering);

function *hello()
{
  this.body = 'Hello Kassis Numbering\n';
}

function do_number(identifier)
{
  var last_value = 0;
  var record_id = 0;

  pg.connect(conString, function(err, client, done) {
    if (err) {
      return -1;
    }

    client.query("SELECT id as record_id, last_value from numbering where identifier = $1", [identifier], function(err, result) {
      if (result.rows.length == 0) {
        return "invalid identifier";
      } else {
        record_id = result.rows[0].record_id;
        last_value = parseInt(result.rows[0].last_value, 10) + 1;

        client.query('UPDATE numbering SET last_value = $2 WHERE id = $1', [record_id, last_value], function (err, result) {
          if (err) return rollback(client);
          //disconnect after successful commit
          //client.query('COMMIT', client.end.bind(client));
          done();

          console.info("commit :" + last_value);
          //return last_value;
        });
      }
    });
  });
  
}

function *numbering(identifier)
{
  var identifier = this.params.identifier;

  var last_value = yield do_number(identifier);
  this.body = last_value;
};

app.use(router.routes());

app.listen(listen_port, function() {
  console.log('kassis numbering is Running on http://localhost:'+listen_port);
})

