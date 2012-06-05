var express = require('express');

//memory storage
//var ArticleProvider = require('./art-memory').ArticleProvider;

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
  
  db.createCollection('requests', function(err, collection){
    db.collection('requests', function(err, collection){
      var requestCollection = collection;
      connect(
        connect.favicon(),                    // Return generic favicon
        connect.query(),                      // populate req.query with query parameters
        connect.bodyParser(),                 // Get JSON data from body
        function(req, res, next){             // Handle the request
          res.setHeader("Content-Type", "application/json");
          if(req.query != null) {
            requestCollection.insert(req.query, function(error, result){
              // result will have the object written to the db so let's just
              // write it back out to the browser
              res.write(JSON.stringify(result));
            });
          }
          
          res.end();
        }
      ).listen(process.env.PORT || 8080);
      // the PORT variable will be assigned by Heroku
    });
  });
});


//mongo storage
var ArticleProvider = require('./art-mongo').ArticleProvider;


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


var articleProvider= new ArticleProvider();

app.get('/', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade', { locals: {
            title: 'Blog',
            articles:docs
            }
        });
    })
});


app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/blog/:id', function(req, res){
    articleProvider.findById(req.params.id, function(error,article){
        res.render('blog_item.jade', { locals: {
              title: article.title,
              article:article
            }
        });
    })
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
