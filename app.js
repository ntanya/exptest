var express = require('express');
var connect = require('connect');
var http = require("http");
var https = require("https");
var mongo = require("mongodb");


var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var mongostr = "mongodb://localhost/dataintel";
var database = null;

function dbsave(data)
{
	mongo.connect(mongostr, {}, function(error, db)
	{		
			console.log("connected, db: " + db);
			
			database = db;
			
			var mycoll = database.collection("leads");
			
			console.log("mycoll: " + mycoll);
			console.log("userdata: " + data);
			mycoll.insert(data, function(){console.log("saved");});
			
			database.addListener("error", function(error){
			console.log("Error connecting to MongoLab");
			
	});
	
	});
}



app.get('/:id', function(req, res){
    
	var user = req.params.id;
	var completeResponse = "";
	
	var options = {
	  host: 'api.twitter.com',
	  port: 80,
	  path: '/1/users/show.json?screen_name=' + user
	};
	
	var request = http.get(options, function(result) {
	  console.log("Got response: " + result.statusCode);
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
	
	
	request.on('response', function (response) {
	  response.on('data', function (chunk) {
	  
	  	res.send("data: " + chunk);
		completeResponse += chunk;
		
	  });
	  
	  response.on('end', function(){
	  
	  	var dataObj =  JSON.parse(completeResponse);
		
		console.log ("parsed");
		
		var saveObj = {
		id: dataObj["id"],
		created_at: dataObj["created_at"],
		description: dataObj["description"],
		followers_count: dataObj["followers_count"],
		friends_count: dataObj["friends_count"],
		location: dataObj["location"],
		name: dataObj["name"]
		};

		//console.log("screen name: " + dataObj["screen_name"]);
		// Only save people with more than 1000 followers
		if(dataObj["followers_count"] > 1000){
			dbsave(saveObj);	  	
	  	}
	    res.send('Saved Twitter user: '  + dataObj["screen_name"] + ", with number of followers: " + dataObj["followers_count"]);
	  
	  });
	});
 
});




var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
