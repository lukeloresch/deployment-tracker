#!/usr/bin/env node
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var Binary = require('mongodb').Binary;
const url = 'mongodb://localhost:27017/deployments';
const dbName = 'deployments';
var db = null;


const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.

// Connect to a single MongoDB instance. The connection string could be that of a remote server
// We assign the connection instance to a constant to be used later in closing the connection

const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.

// Connect to a single MongoDB instance. The connection string could be that of a remote server
// We assign the connection instance to a constant to be used later in closing the connection
const db = mongoose.connect('mongodb://localhost:27017/deployments');



var argv = require('yargs')
  .usage('Usage: $0 -e [str] -n [str] -c [int] -b [str] -d for deployment, -g for get deployments')
  .help('help').alias('help', 'h')
  .options({
    environment: {
      alias: 'e',
      description: "<envrionment> environment name",
      requiresArg: true,
    },
    image: {
    alias: 'i',
      description: "<service image> name of service",
      requiresArg: true,
    },
    name: {
      alias: 'n',
      description: "<service name> name of service",
      requiresArg: true,
    },
    branch: {
      alias: 'b',
      description: "<branch name> name of branch",
      requiresArg: true,
    },
    commit: {
      alias: 'c',
      description: "<commit id> commit id",
      requiresArg: true,
    },
    serviceJson: {
      alias: 'j',
      description: "<serivce.jsonfile>",
      requiresArg: true,
    },
    deployment: {
      alias: 'd',
       boolean: true
    },
    filter: {
      alias: 'f',
      requiresArg: true
    },
    get: {
      alias: 'g',
      requiresArg: true,
      description: "pass a for get all deployments or f \"key value\" query"
    }

  })
  .argv;

// Define a contact Schema
const deploymentSchema = mongoose.Schema({
  servicename: { type: String, set: toLower },
  branch: { type: String, set: toLower },
  commit: { type: String, set: toLower },
  serviceJson: { type: String, set: toLower },
  image: { type: String, set: toLower },
  date: { type: String, set: toLower },
});

// Define model as an interface with the database
const Deployment = mongoose.model('Deployment', deploymentSchema);


/**
 * @function  [addContact]
 * @returns {String} Status
 */
const addContact = (deployment) => {
  Contact.create(contact, (err) => {
    assert.equal(null, err);
    console.info('New contact added');
    db.disconnect();
  });
};

/**
 * @function  [getContact]
 * @returns {Json} contacts
 */
const getContact = (name) => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  Contact.find({$or: [{firstname: search }, {lastname: search }]})
  .exec((err, contact) => {
    assert.equal(null, err);
    console.info(contact);
    console.info(`${contact.length} matches`);
    db.disconnect();
  });
};

// Export all methods
module.exports = {  addContact, getContact };

  if (argv.d) {
    
    MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
	  const db = client.db(dbName);
	  recordDeployment(db, function() {
      client.close();
    });
  });

  } else if (argv.g && argv.a) {
    conn.then((db) => {
      db.collection(argv.environment).find({}).toArray().then((docs) => {
        console.log(docs)
        return docs;
      });
    });
    conn.close()

    /*
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
	    const db = client.db(dbName);
	    readAllDeployments(db, function() {
        client.close();
      });
    });
    */
 } else if (argv.g && argv.f) {
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
	    const db = client.db(dbName);
	    readFilterDeployments(db, argv.filter, function() {
        client.close();
      });
    });
  }

const readFilterDeployments = function(db, filterParam, callback) {
  var collection = db.collection(argv.environment);
  //filter is in form "key value"
  var sp = filterParam.split(" ");
  let key = sp[0];
  let value = sp[1];

  var exp = new RegExp('^(.*?)' + value)
  //let query = { key: exp }
  var query = {};
  query[key] = exp;
 
  collection.find(query).toArray((err, docs) => {
    if (err) throw err;
    console.log(docs)
    callback(docs);;
  })
}

const readAllDeployments = function(db, callback) {
 const collection = db.collection(argv.e);
  collection.find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    callback(result)
  });
}

const recordDeployment = function(db, callback) {
  let d = new Date();
  if (argv.serviceJson) {
    var data = fs.readFileSync(`${process.cwd()}/etc/service.json`);
    var insert_data = {};
    insert_data.file_data = Binary(data);
  } else {
    var insert_data = {}
  }
 
  // Get the documents collection
  const collection = db.collection(argv.e);
   let doc = {
    date: d,
    serviceName: argv.name,
    branch: argv.branch,
    commit: argv.commit,
    serviceJson: insert_data,
    image: argv.image
  }
 
  collection.insertOne(doc, function (err, res) {
    if (err) throw err;
    console.log("inserted doc");
    callback(res);
  });
}



