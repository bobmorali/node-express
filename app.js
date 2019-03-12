**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bookingProvider = require('./bookingprovider').bookingProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var bookingProvider= new bookingProvider('localhost', 27017);

//Routes

//index
app.get('/', function(req, res){
  bookingProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'bookings',
            bookings:emps
        });
  });
});

//new booking
app.get('/booking/new', function(req, res) {
    res.render('booking_new', {
        title: 'New booking'
    });
});

//save new booking
app.post('/booking/new', function(req, res){
    bookingProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an booking
app.get('/booking/:id/edit', function(req, res) {
	bookingProvider.findById(req.param('_id'), function(error, booking) {
		res.render('booking_edit',
		{ 
			title: booking.title,
			booking: booking
		});
	});
});

//save updated booking
app.post('/booking/:id/edit', function(req, res) {
	bookingProvider.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an booking
app.post('/booking/:id/delete', function(req, res) {
	bookingProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
