var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1";
var dbName = "deployments";
var _db;

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(url + dbName, function(err, db) {
      _db = db;
      return callback(err);
    });
  },
  getDb: function() {
    return _db;
  }
};
