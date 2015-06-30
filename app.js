var logger = require('koa-logger');
var app = require('koa')();
var router = require('koa-router')();

var conString = "postgres://kassis@localhost/kassis_numbering";
var listen_port = 8002;

var pg = require('pg');

// logger
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/', hello);
router.get('/num/identifier/:identifier', numbering);

function *hello()
{
  this.body = 'Hello World!!!!';
}

function *numbering(identifier)
{
  console.log(this.params);

  var identifier = this.params.identifier;
  var last_value = 0;

  pg.connect(conString, function(err, client, done) {
    this.body = 'Hello World!3';

    if (err) {
      this.throw(404, 'invalid connect');
    }
    console.info("select");

    client.query("SELECT last_value from numbering where identifier = $1", [identifier], function(err, result) {
      done();

      console.log("Row count: %d", result.rows.length);
      if (result.rows.length == 0) {
        this.throw(404, 'invalid identifier');
      }

      last_value = result.rows[0].last_value + 1;
    });

    console.log("aaa");
  });

  this.body = 'Hello World!3';
};

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(listen_port);

console.log('kassis numbering is Running on http://localhost:'+listen_port);
