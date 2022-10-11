const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const AWS = require('aws-sdk');
const indexRouter = require('./routes/index')

// const SESSION_TABLE = process.env.SESSION_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
global.dynamoDb = dynamoDb

app.use(express.json());
app.use(cors());

app.use('/', indexRouter);

module.exports.handler = serverless(app);