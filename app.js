const express = require('express');
const cors = require('cors');
const routes = require('./routes/route');

const { config } = require('./middleware/config');

console.log(config)

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(cors({ origin: '*', credentials: true }));

const Port = config.Port || 4123;

app.listen(Port);

app.use(routes);