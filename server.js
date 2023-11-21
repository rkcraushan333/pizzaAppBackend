import express from 'express';
import { APP_PORT, DB_URL } from './config/index.js';
import mongoose from 'mongoose';

import cors from 'cors';

const app = express();

app.use(cors());

import routes from './routes/index.js'
import errorHandler from './middlewares/errorHandlers.js';

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB connected...');
});

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}.`));