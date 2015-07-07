var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var _s = require("underscore.string");

var conString = process.env.KASSIS_NUMBER_DATABASE_URL || "postgres://kassis@localhost/kassis_numbering";

//ルーティング設定
router.get('/', function (req, res, next) {
    //res.send('Hello Kassis Numbering\n');
    //res.sendFile(path.join(__dirname, 'views', 'index.html'));
    res.sendFile(path.join(__dirname, '..', 'client', 'views', 'index.html'));
});
// List
router.get('/identifiers', function (req, res) {

    var results = [];

    pg.connect(conString, function(err, client, done) {
        if (err) {
            res.json({"status": 500, "msg": "database error."});
            return;
        }

        var query = client.query("SELECT * FROM numbering ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }
    });
});
// Create
router.post('/identifier', function (req, res) {

    var results = [];

    // Grab data from http request
    var data = {identifier: req.body.identifier,
        display_name: req.body.display_name,
        prefix: req.body.prefix,
        suffix: req.body.suffix,
        is_padding: req.body.is_padding,
        padding_lengthp: req.body.padding_length,
        padding_character: req.body.padding_character};

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query("INSERT INTO numbering" +
            "(identifier, display_name, prefix, suffix, is_padding, padding_length, padding_character) " +
            " values " +
            "($1, $2, $3, $4, $5, $6, $7)",
            [data.identifier,
                data.display_name,
                data.prefix,
                data.suffix,
                data.is_padding,
                data.padding_length,
                data.padding_character,
            ]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM numbering ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });
});
// Read
router.get('/identifier/:id', function(req, res) {

    var results;
    var id = req.params.id;

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM numbering WHERE id = $1;", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results = row;
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });
});
// UPDATE
router.put('/identifier/:id', function(req, res) {

    var results = [];
    var id = req.params.id;

    var data = {
        display_name: req.body.display_name,
        prefix: req.body.prefix,
        suffix: req.body.suffix,
        is_padding: req.body.is_padding,
        padding_lengthp: req.body.padding_length,
        padding_character: req.body.padding_character,
        last_value: req.body.last_value};

    pg.connect(conString, function(err, client, done) {

        // SQL Query > Update Data
        client.query("UPDATE items SET " +
            " display_name = ($1), " +
            " prefix = ($2), " +
            " suffix = ($3), " +
            " is_padding = ($4), " +
            " padding_length = ($5), " +
            " padding_character = ($6), " +
            " last_value = ($7)" +
            " WHERE id=($8)",
            [
                data.display_name,
                data.prefix,
                data.suffix,
                data.is_padding,
                data.padding_length,
                data.padding_character,
                data.last_value,
                id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }
    });
});
// DELETE
router.delete('/identifier/:id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.id;


    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        // SQL Query > Delete Data
        client.query("DELETE FROM numbering WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM numbering ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });
});
// NUMBERING
router.get('/numbering/:identifier', function (req, res) {
    var identifier = req.params.identifier;
    var last_value = 0;
    var record_id = 0;

    pg.connect(conString, function(err, client, done) {
        if (err) {
            res.json({"status": 500, "msg": "database error."});
            return;
        }

        client.query("SELECT id as record_id, " +
                     " is_padding, prefix, suffix, padding_length, padding_character, " +
                     " last_value from numbering where identifier = $1", [identifier], function(err, result) {
            if (result.rows.length == 0) {
                res.json({"status": 404, "msg": "invalid identifier"});
            } else {
                record_id = result.rows[0].record_id;
                result_value = last_value = parseInt(result.rows[0].last_value, 10) + 1;

                if (result.rows[0].is_padding == 1) {
                    result_value = _s.lpad(last_value, result.rows[0].padding_length, result.rows[0].padding_character);
                }
                if (result.rows[0].prefix && result.rows[0].prefix != "") {
                    result_value = result.rows[0].prefix + result_value;
                }
                if (result.rows[0].suffix && result.rows[0].suffix != "") {
                    result_value = result_value + result.rows[0].suffix;
                }

                client.query('UPDATE numbering SET last_value = $2 WHERE id = $1', [record_id, last_value], function (err, result) {
                    if (err) return rollback(client);
                    //disconnect after successful commit
                    //client.query('COMMIT', client.end.bind(client));
                    done();

                    res.json({"status": 200, 'last_value': "" + result_value + "" });
                });
            }
        });
    });
});

module.exports = router;
