require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const corsOptions = require('./cors-whitelist');
const helmet = require('helmet');
const { NODE_ENV } = require('./config')
const winston = require('winston');
const logger = require('./logger');
const bookmarkRouter = require('./bookmark-router/bookmarkRouter');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


app.use(morgan(morganOption));
app.use(cors({origin: corsOptions}));
app.use(express.json());
app.use(helmet());

// =============================================================================
// API_KEY verification
// =============================================================================

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.REACT_APP_API_KEY;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request'})
  }
  next()
});

// =============================================================================
// Hello world
// =============================================================================

app.get('/', (req, res) => {
    res.send('Hello, boilerplate!')
});

// =============================================================================
// Bookmarks endpoint
// =============================================================================

app.use('/bookmarks', bookmarkRouter);

// =============================================================================
// Error handler
// =============================================================================

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }

    if(error.type === 'CORS') {
      res.status(403).end()
    }
    res.status(500).json(response)
    
});

module.exports = app;