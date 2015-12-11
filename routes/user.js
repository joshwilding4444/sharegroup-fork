var router = express.Router();
var Users = require('../models/users')

router.get('/dashboard', function(req, res){
  if (cfg.access_token === ''){
    res.redirect('/')
  }

  else{
    if(Date.parse(req.session.cookie.expires) < Date.now()){
      access_token = ''
      res.redirect('/')
    } else {

    var options = {
      url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + cfg.access_token
    }
    var userInfo = {
      url : 'https://api.instagram.com/v1/users/self/?access_token=' + cfg.access_token
    }
    request.get(options, function(error, response, body){
      var feed = JSON.parse(body)
      request.get(userInfo, function(error, response, body){
        try {
          var user = JSON.parse(body).data
          //console.log(user)
          var inputUser = {
            'username' : user.username,
            'full_name' : user.full_name,
            'profile_picture' : user.profile_picture,
            'bio' : user.bio,
            'website' : user.website
          }
          console.log('User object created locally:')
          Users.find(inputUser, function(document){
              if(!document) {
                Users.insert(inputUser)
              }
          })
        } catch(err) {
          var user = ''
        }
        res.render('dashboard', {
           user : user,
           feed: feed.data,
           layout: 'auth_base',
           title: 'User Dashboard!',
           pageintro: 'Welcome to your dashboard!'
         })
        })
      })
    }
  }
})

  router.get('/profile', function(req, res){
    if (cfg.access_token === ''){
      res.redirect('/')
    } else if(Date.parse(req.session.cookie.expires) < Date.now()){
      access_token = ''
      res.redirect('/')
    } else {

      var options = {
        url : 'https://api.instagram.com/v1/users/self/?access_token=' + cfg.access_token
      }
      request.get(options, function(error, response, body){
        var userInfo = JSON.parse(body)
        Users.find(userInfo.data, function(document){
          res.render('profile', {
            user : document,
            layout : 'auth_base'
          })
        })
      })
    }
  })

  router.get('/search', function(req, res){
    if (cfg.access_token === ''){
      res.redirect('/')
    }

    else{
      console.log(req.query)            //log the query string to the console
      //Put the entire search URL together.
      try {
        searchInput = req.query.search //construct part of the query string, using the user input
        console.log('Search data is ' + searchInput)
        var searchURL = 'https://api.instagram.com/v1/tags/' + searchInput + '/media/recent?access_token=' + cfg.access_token
      } catch(err) {
        var searchURL = 'https://api.instagram.com/v1/tags/instagram' + cfg.access_token
      }
      //console.log(searchURL)    //log the complete GET request URL to the console
      var searchOptions = {     //create an options object to be sent to the request.get() function
        url: searchURL          //Defining the URL here, instead of within the 'searchURL' variable,
      }                         //results in the search placing 'undefined' into the searchInput variable
      //console.log(options)
      var userInfo = {
        url : 'https://api.instagram.com/v1/users/self/?access_token=' + cfg.access_token
      }

      request.get(searchOptions, function(error, response, body){
        try {
          var searchFeed = JSON.parse(body)     //This object contains the Intagram search results
        } catch(err) {
          console.log(searchOptions)
        }
        request.get(userInfo, function(error, response, body){
          var user = JSON.parse(body)
          try {
            var feed = searchFeed.data;

            res.render('search', {
             search_input : searchInput,
             feed: searchFeed.data,
             user: user.data,
             layout: 'auth_base',
             title: 'Search Page!',
             //Shows the user the current search query
             pageintro: 'Search Instagram for #' + searchInput + ' Add to saved searches?'
           })

          } catch (err) {
            res.redirect('/user/dashboard')
          }
      })
    })
  }
  request.post('/savedsearch', function(req, res){
    var userId = req.session.userId
    Users.find(req.session.userId, function(){
      Users.addTag(userId, searchInput, function(req, res){
        res.render('savedsearch')
      })
    })
  })
})


module.exports = router
