require('dotenv').config();

// Obtain config from the environment
const DBHOST = process.env.DBHOST || 'localhost';
const DBPORT = process.env.DBPORT || '27017';
const DATA = process.env.DATA || 'gateways';
const WAIT = parseInt(process.env.WAIT || 3000, 10);

console.log(WAIT);

let connectionUrl = `mongodb://${DBHOST}:${DBPORT}/${DATA}`;
console.log(`CONNECTION URL: ${connectionUrl}`);

/**
 * Connection to DB
 */
import { set, connect, connection } from 'mongoose';
setTimeout(function () {
    set("strictQuery",true);
    connect(connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => {
        console.log('Database connected')
    });
}, WAIT);