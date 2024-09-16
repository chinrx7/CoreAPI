const express = require('express');
const cors = require('cors');
const routes = require('./routes/route');
const logger = require('./middleware/log');

const { config } = require('./middleware/config');

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(cors({ origin: '*', credentials: true }));

const Port = config.PORT || 4123;

app.listen(Port);
logger.loginfo('CoreAPI', 'Started and listen at port: ' + Port, 'Info');

app.use(routes);