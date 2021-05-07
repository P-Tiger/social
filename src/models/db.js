import mongoose from 'mongoose';
import { cfg } from '../config';
import {
    getLogger
} from '../services/logger';
const logger = getLogger('database');
mongoose.connect(cfg("DB_LINK", String), { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.set('bufferCommands', false);
const DB = mongoose.connection;
DB.on('error', (err) => {
    logger.error(`(MongoDB) Unable to connect to the database: \n%o`, err);
});
DB.once('open', function () {
    logger.info(`Connection (MongoDB) has been established successfully.`);
});

export default DB;