const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.

mongoose.connect('mongodb://localhost/deployments');

var connection = mongoose.connection;

const db = mongoose.connection;
const deploymentSchema = mongoose.Schema({
  servicename: { type: String },
  image: { type: String },
  branch: { type: String },
  commit: { type: String },
  date: { type: Date }
});

// Define model as an interface with the database
const Deployment = mongoose.model('Deployment', deploymentSchema);

const addDeployment = (deployment) => {
  let d = new Date();
  //deployment.date = d;
  console.log(deployment);
  let environment = deployment.environment

  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', function () {
    connection.db.collection(environment, function(err, collection){
      collection.insert(deployment);
    });
  });
connection.close();
};

const getDeployment = (environment, key, value) => {
  var exp = new RegExp('^(.*?)auth')
  var query = {};
  query[key] = exp;
 
  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', function () {
    connection.db.collection(environment, function(err, collection){
      collection.find({}).toArray(function(err, data){
        console.log(data); // it will print your collection data
      })
    });
  });
connection.close();
};

module.exports = {  addDeployment, getDeployment };
