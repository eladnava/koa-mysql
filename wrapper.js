var mysql = require('mysql');

// Thunkify query methods
function wrapQueryMethod(fn, ctx) {
    return function() {
        // Obtain function arguments
        var args = [].slice.call(arguments);
        
        // Return a thunkified function that receives a done callback
        return function(done) {
            // Add a custom callback to provided args
            args.push(function(err, result) {
                // Query failed?
                if (err) {
                    return done(err);
                }

                // Query succeeded
                done(null, result);
            });

            // Execute the query
            fn.apply(ctx, args);
        };
    };
}

// Wrap a MySQL connection object's query methods
function wrapConnection(conn) {
    // Already wrapped this function?
    if (conn._coWrapped) {
        return conn;
    }
        
    // Set flag to avoid re-wrapping
    conn._coWrapped = true;

    // Functions to thunkify
    var queryMethods = [
        'query',
        'execute'
    ];
    
    // Traverse query methods list
    queryMethods.forEach(function(name) {
        // Thunkify the method
        conn[name] = wrapQueryMethod(conn[name], conn);
    });
    
    // Return co-friendly connection
    return conn;
}

module.exports = {
    createConnection: function(opts) {
        // Wrap createConnectionfunction
        return wrapConnection(mysql.createConnection(opts));
    },

    createPool: function(opts) {
        // Wrap createPool function
        return wrapConnection(mysql.createPool(opts));
    }
};