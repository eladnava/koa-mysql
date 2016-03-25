var koa = require('koa');

// Change to 'koa-mysql' if you use this code outside of the package
var mysql = require('../');

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