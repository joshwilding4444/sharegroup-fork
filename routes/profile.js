var router = express.Router();

router.get('/', function(req, res){
  if (cfg.access_token === ''){
    res.redirect('/')
  } else {
    var options = {
      url : 'https://api.instagram.com/v1/users/self/?access_token=' + cfg.access_token
    }
    request.get(options, function(error, response, body){
      var userInfo = JSON.parse(body)
      res.render('profile', {
        user : userInfo.data,
        layout : 'auth_base'
      })
    })
  }
})

module.exports = router
