var router = express.Router();

router.get('/dashboard', function(req, res){
  if (cfg.access_token === ''){
    res.redirect('/')
  }

  else{
    var options = {
      url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + cfg.access_token
    }
    var userInfo = {
      url : 'https://api.instagram.com/v1/users/self/?access_token=' + cfg.access_token
    }

    request.get(options, function(error, response, body){
      var feed = JSON.parse(body)
      request.get(userInfo, function(error, response, body){
        var user = JSON.parse(body)

        res.render('dashboard', {
           user : user.data,
           feed: feed.data,
           layout: 'auth_base',
           title: 'User Dashboard!',
           pageintro: 'Welcome to your dashboard!'
         })
        })
      })
      //console.log(body)

  }
})

module.exports = router
