var express = require('express');
var router = express.Router();
var path = require('path');
var root = __dirname.substr(0, __dirname.lastIndexOf('/'));
var Client = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var dbUrl = 'mongodb://localhost:27017/test';

var insert = function(db, data, callback) {
  db.collection('library')
    .insertOne(data, function(err, result) {
      assert.equal(null, err);
      console.log("Inserted: ", data);
      callback();
  });
};

var find = function(db, data, callback) {
  db.collection('library')
    .findOne({ title: data }, function(err, result) {
      assert.equal(null, err);
      callback(result);
    });
};

var findAll = function(db, callback) {
  var cursor = db.collection('library').find();
  var listResponse = [];
  cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         listResponse.push(doc);
       } else {
         callback(listResponse);
       }
  });
};

var erase = function(db, data, callback) {
  db.collection('library')
    .deleteOne({_id: ObjectId(data)}, function(err, result) {
      assert.equal(null, err);
      console.log(result);
      callback(result);
    });
};

var update = function(db, data, callback) {
  db.collection('library')
    .update({_id: ObjectId(data._id)},
    {
        title     : data.title,
        author    : data.author,
        imageUrl  : data.imageUrl,
        cost      : data.cost
    }
    , function(err, result) {
      assert.equal(null, err);
      console.log(result);
      callback();
    });
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(root,'/public/views', 'index.html'));
});

router.get('/find', function(req, res, next) {
  var query = req.query.query;
  Client.connect(dbUrl, function(err, db){
    assert.equal(null, err);
    if(query !== "allf1ae533afea") {
      find(db, query, function(result){
        db.close();
        res.send([result]);
      });
    } else {
      findAll(db, function(result) {
        var responseList = result;
        db.close();
        res.send(responseList);
      });
    }

  });
});

router.post('/add', function(req, res, next) {
  var data = JSON.parse(Object.keys(req.body)[0]).data;
  Client.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    insert(db, data, function(){
      db.close();
      res.send(data.title);
    });
  });
});

router.delete('/remove', function(req, res, next) {
  console.log(req.query.id);
  Client.connect(dbUrl, function(err, db){
    assert.equal(null, err);
    erase(db, req.query.id, function(result){
      db.close();
      res.send(req.query.id);
    });
  });
});

router.post('/update', function(req, res, next) {
  var data = JSON.parse(Object.keys(req.body)[0]).data;
  console.log(data);
  Client.connect(dbUrl, function(err, db) {
    assert.equal(null, err);
    update(db, data, function(){
      db.close();
      res.send(data);
    });
  });
});

module.exports = router;
