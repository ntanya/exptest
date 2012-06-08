//specify env if app runs on Heroku or localhost
//var port = process.env.PORT || 27017;
//var mongoHost = process.env.MONGOLAB_URI || 'localhost';

var mongostr = "mongodb://heroku_app4943648:a522qdedvi1nm06g30ccb5jic9@ds033087.mongolab.com:33087/heroku_app4943648";
var localstr = "mongodb://localhost/node-mongo-blog";

//mongodb://heroku_app4943648:a522qdedvi1nm06g30ccb5jic9@ds033087.mongolab.com:33087/heroku_app4943648


var connect = require('connect');
var mongo = require('mongodb');
var database = null;

/*
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

*/

// Get all twitter followers of a famous influencer, store them in the db
// API call:

var user = "twitterapi"

var options = {
  host: 'https://api.twitter.com/1/users/show.json?screen_name=' + user + '&include_entities=true',
  port: 80,
  path: '/upload',
  method: 'POST'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();



// Determine if the person is worth storing (twitter followers > 50, etc)
// API call: 

// Get t


//getCollection




/*
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

*/