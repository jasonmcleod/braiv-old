module.exports.session = {
    secret: 'c9e4312ee96dab5c913f994ffd1bba33',

    adapter: 'redis',

    host: '127.0.0.1',
    port: 6379,
    ttl: 1000 * 60 * 30,
    db: 0,
    pass: 'l!x$$#x2jljnj4kb3y',
    prefix: 'sess:'
};