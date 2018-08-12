const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.
const fs = require('fs')
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
  deployment.date = d;
  let environment = deployment.environment
  var fileDataJson = getFileContents(deployment.serviceJson)
  deployment.serviceJsonData = fileDataJson;
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

//will generate all service.jsons ina  directory with a script to run with swarm builder and .the correct images...
const replay = (environment) => {
  var replayArray = [];
  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', function() {
    connection.db.collection(environment, (err, collection) => {
      collection.distinct('serviceName', (err, names) => {
        if (err) throw err;
        replayArray = names;
        names.forEach((name) => {
          replayArray.push(name);
        });
        //console.log(replayArray)
//names is an array of all distinct service names...need to take each name and find its correcsponidng collection and get that data
      });
    });
  });
  connection.close();
}

const getFileContents = (path) => {
  var content = fs.readFileSync(path)
  var jsonContent = JSON.parse(content);
  //console.log("file content: \n", jsonContent);
  return jsonContent;
}


module.exports = {  addDeployment, getDeployment, replay };
