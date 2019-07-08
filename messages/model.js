const Sequelize = require('sequelize');
const db = require('../db.js');

const Messages = db.define(
  'message',
  {
    message: {
      type: Sequelize.STRING,
      field: 'message'
    }
  },
  { tableName: 'messages' }
);
module.exports = Messages;
