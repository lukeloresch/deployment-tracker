#!/usr/bin/env node
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'deployments';
var argv = require('yargs')
  .usage('Usage: $0 -e [str] -n [str]')
  .help('help').alias('help', 'h')
  .options({
    environment: {
      alias: 'e',
      description: "<envrionment> environment name",
      requiresArg: true,
      required: true
    },
    name: {
      alias: 'n',
      description: "<service name> name of service",
      requiresArg: true,
      required: true
    },
    branch: {
      alias: 'b',
      description: "<branch name> name of branch",
      requiresArg: true,
      required: true
    },
    commit: {
      alias: 'c',
      description: "<commit id> commit id",
      requiresArg: true,
      required: true
    },
    serviceJson: {
      alias: 'j',
      description: "<serivce.jsonfile>",
      requiresArg: true,
      required: true
    }
  })
  .argv;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
	const db = client.db(dbName);
	recordDeployment(db, function() {
    client.close();
  });
});

const recordDeployment = function(db, callback) {
  let d = new Date();
  // Get the documents collection
  const collection = db.collection(argv.e);
   let doc = {
    date: d,
    serviceName: argv.name,
    branch: argv.branch,
    commit: argv.commit,
    serviceJson: argv.serviceJson
  }

  collection.insertOne(doc, function (err, res) {
    if (err) throw err;
    console.log("inserted doc", res.ops[0]);
  });
}   
    
 /* 
  collection.insertMany([
    { date: new Date(Date.now()).toISOString() },
    { serviceName: argv.name },
    { branch: argv.branch },
    { commit: argv.commit },
    { serviceJson: argv.serviceJson }
  ], function(err, result) {
    callback(result);
  });

  */
//}
