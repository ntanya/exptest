/*
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
*/


//specify env if app runs on Heroku or localhost
//var port = process.env.PORT || 27017;
//var mongoHost = process.env.MONGOLAB_URI || 'localhost';

var mongostr = "mongodb://heroku_app4943648:a522qdedvi1nm06g30ccb5jic9@ds033087.mongolab.com:33087/heroku_app4943648";
var localstr = "mongodb://localhost/node-mongo-blog";

//mongodb://heroku_app4943648:a522qdedvi1nm06g30ccb5jic9@ds033087.mongolab.com:33087/heroku_app4943648


var connect = require('connect');
var mongo = require('mongodb');
var database = null;

ArticleProvider = function() {

mongo.connect(mongostr, {}, function(error, db)
	{		
			console.log("connected, db: " + db);
			
			database = db;
			
			database.addListener("error", function(error){
			console.log("Error connecting to MongoLab");
			
			});
});

};

//getCollection

ArticleProvider.prototype.getCollection= function(callback) {

  database.collection('articles', function(error, article_collection) {
  	console.log("error in getCollection: " + error);
    if( error ) callback(error);
    else callback(null, article_collection);
  });
};

//findAll
ArticleProvider.prototype.findAll = function(callback) {
	console.log("in FindAll");
    this.getCollection(function(error, article_collection) {
    	console.log("error: " + error);
      if( error ) callback(error)
      else {
      	console.log("in else part");
        article_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findById

ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//save
ArticleProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        if( typeof(articles.length)=="undefined")
          articles = [articles];

        for( var i =0;i< articles.length;i++ ) {
          article = articles[i];
          article.created_at = new Date();
          if( article.comments === undefined ) article.comments = [];
          for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
          }
        }

        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

exports.ArticleProvider = ArticleProvider;