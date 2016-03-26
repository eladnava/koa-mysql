# koa-mysql
[![npm version](https://badge.fury.io/js/koa-mysql.svg)](https://www.npmjs.com/package/koa-mysql)

A Node.js [Koa](https://github.com/koajs/koa) wrapper for [felixge/node-mysql](https://github.com/felixge/node-mysql) based off of [sidorares/mysql-co](https://github.com/sidorares/mysql-co).

## Requirements
* Node.js v4.x+ for ES6 generators support

## Usage

First, install the package using npm:
```shell
npm install koa-mysql --save
```

Then, execute a query within a Koa middleware function using the following code:

```js
var mysql = require('koa-mysql');

// Create a MySQL connection pool (do this once)
var db = mysql.createPool({ user: 'root', password: '', database: 'test', host: 'localhost' });

// Execute a sample query (with params)
var rows = yield db.query("select ? + ? as test", [1, 2]);

// Output test result (3)
this.body = { test: rows[0].test };
```

## Koa Example

Here's a more complete example that includes creating a basic Koa app and executing a query (also available in `examples/query.js`):

```js
var koa = require('koa');
var mysql = require('koa-mysql');

// Create a MySQL connection pool (do this once)
var db = mysql.createPool({ user: 'root', password: '', database: 'test', host: 'localhost' });

// Create sample app
var app = koa();

// Run sample app
app.use(function* () {
    try {
        // Execute a sample query (with params)
        var rows = yield db.query("select ? + ? as test", [1, 2]);

        // Output test result (3)
        this.body = { test: rows[0].test };
    }
    catch (err) {
        // 500 Internal Server Error
        this.status = 500;
        this.body = { error: err };
    }
});

// HTTP port
var port = process.env.PORT || 3000;

// Listen for connections
app.listen(port);

// Log port
console.log('Server listening on port ' + port);
```

Run the script and visit [http://localhost:3000/](http://localhost:3000/) to test it out. The server should return `{ test: 3 }`.

## License
Apache 2.0
