var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;



//specify env if app runs on Heroku or localhost
//var port = process.env.PORT || 27017;
//var mongoHost = process.env.MONGOLAB_URI || 'localhost';

//mongodb://heroku_app4943648:a522qdedvi1nm06g30ccb5jic9@ds033087.mongolab.com:33087/heroku_app4943648

ArticleProvider = function() {
	var connect = require('connect'),
        mongo = require('mongodb');

    // Connect to a mongo database via URI
	// With the MongoLab addon the MONGOLAB_URI config variable is added to your
	// Heroku environment.  It can be accessed as process.env.MONGOLAB_URI
	mongo.connect(process.env.MONGOLAB_URI, {}, function(error, db){

	  // console.log will write to the heroku log which can be accessed via the 
	  // command line as "heroku logs"
	  db.addListener("error", function(error){
	    console.log("Error connecting to MongoLab");
	  });
	  
	    this.db = db;
  		this.db.open(function(){});
	});
  

  //this.db= new Db('heroku_app4943648', new Server('heroku_app4943648:a522qdedvi1nm06g30ccb5jic9@ds033087.mongolab.com', 33087, {auto_reconnect: true}, {}));
  //this.db.open(function(){});
  

};


//getCollection

ArticleProvider.prototype.getCollection= function(callback) {
  this.db.collection('articles', function(error, article_collection) {
    if( error ) callback(error);
    else callback(null, article_collection);
  });
};

//findAll
ArticleProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
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