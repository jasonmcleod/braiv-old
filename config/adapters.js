module.exports.adapters = {
    // If you leave the adapter config unspecified 
    // in a model definition, 'default' will be used.
    // 'default': 'disk',
    'default':process.env.NODE_ENV == 'production' ? 'mysqlProd' : 'mysqlLocal',

    // Persistent adapter for DEVELOPMENT ONLY
    // (data is preserved when the server shuts down)
    disk: {
        module: 'sails-disk'
    },

    // MySQL is the world's most popular relational database.
    // Learn more: http://en.wikipedia.org/wiki/MySQL
    mysqlLocal: {
        module: 'sails-mysql',
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'braiv-sails'
    },
    mysqlProd: {
        module: 'sails-mysql',
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'braiv-sails'
    }
};