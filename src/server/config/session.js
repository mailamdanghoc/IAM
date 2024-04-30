const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');
const { Cookie } = require('express-session');

function createSessionStore(){
    const mongoDBStore = mongoDbStore(expressSession);

    const store = new mongoDBStore({
        uri: 'mongodb://127.0.0.1:27017',
        databaseName: 'mmanm',
        collection: 'sessions'
    })

    return store;
}

function createSessionConfig(){
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2*24*60*60*1000
        }
    };
}

module.exports = createSessionConfig;