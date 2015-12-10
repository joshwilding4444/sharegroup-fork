var db = require('./public/js/db')
var ObjectId = require('mongodb').ObjectId
var assert = require('assert')

exports.find = function(user, callback){
  var collection = db.get().collection('users')
  collection.findOne({'username': user.username }, function(err, document){
    assert.equal(err, null)
    console.log('Found 1 user document')
    callback(document)
  })
}

exports.insert = function(user, callback){
  var collection = db.get().collection('users')
  collection.insert(user, function(err, result){
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log('Inserted 1 user into users collection')
    callback(result)
  })
}
