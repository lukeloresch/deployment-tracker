#!/usr/bin/env node
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var Binary = require('mongodb').Binary;

const url = 'mongodb://localhost:27017';
const dbName = 'deployments';

var argv = require('yargs')
  .usage('Usage: $0 -e [str] -n [str] -c [int] -b [str] -d for deployment, -g for get deployments')
  .help('help').alias('help', 'h')
  .options({
    environment: {
      alias: 'e',
      description: "<envrionment> environment name",
      requiresArg: true,
//      required: true
    },
    image: {
    alias: 'i',
      description: "<service image> name of service",
      requiresArg: true,
      //required: true
    },
    name: {
      alias: 'n',
      description: "<service name> name of service",
      requiresArg: true,
      //required: true
    },
    branch: {
      alias: 'b',
      description: "<branch name> name of branch",
      requiresArg: true,
      //required: true
    },
    commit: {
      alias: 'c',
      description: "<commit id> commit id",
      requiresArg: true,
      //required: true
    },
    serviceJson: {
      alias: 'j',
      description: "<serivce.jsonfile>",
      requiresArg: true,
      //required: true
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
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
	    const db = client.db(dbName);
	    readAllDeployments(db, function() {
        client.close();
      });
    });
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
  var data = fs.readFileSync(`${process.cwd()}/etc/service.json`);
  var insert_data = {};
  insert_data.file_data = Binary(data);
 
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
