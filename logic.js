const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.

mongoose.connect('mongodb://localhost/deployments');

var connection = mongoose.connection;

// Connect to a single MongoDB instance. The connection string could be that of a remote server
// We assign the connection instance to a constant to be used later in closing the connection
//mongoose.connect('mongodb://localhost:27017/deployments');
const db = mongoose.connection;

// Converts value to lowercase

// Define a contact Schema
const deploymentSchema = mongoose.Schema({
  servicename: { type: String },
  image: { type: String },
  branch: { type: String },
  commit: { type: String },
  date: { type: Date }
});//, {collection: 'dev'});

// Define model as an interface with the database
const Deployment = mongoose.model('Deployment', deploymentSchema);

/**
 * @function  [addContact]
 * @returns {String} Status
 */
const addDeployment = (deployment) => {
  let d = new Date();
  deployment.date = d;
  Deployment.create(deployment, (err) => {
    assert.equal(null, err);
    console.info('New deployment added');
    db.disconnect();
    connection.close();
    
  });
};

/**
 * @function  [getContact]
 * @returns {Json} contacts
 */
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
