express     = require('express')
exphbs      = require('express-handlebars')
request     = require('request')
bodyParser  = require('body-parser')
path	      = require('path')
indexRoutes	= require('./routes/index.js')
userRoutes	= require('./routes/user.js')
session = require('express-session')
querystring = require('querystring')
client = require('./public/js/db')
cfg = require('./config.js')


var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');
app.use(bodyParser());

app.use(session({
  cookieName: 'session',
  secret: 'jijf849hfinvufenv7834bbs283s',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires : Date.now() + 60000
  }
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes)
app.use('/user', userRoutes)

client.connect(cfg.db_connect, function(err){
  if(err){
    console.log('Error in connecting to Mongo. Please check your database connections')
    process.exit(1)
  } else {
    app.listen(3000)
  }
})
