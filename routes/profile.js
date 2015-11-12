var router = express.Router();

router.get('/', function(req, res){
  if (cfg.access_token === ''){
    res.redirect('/')
  } else {
    var userInfo = {
      url : 'https://api.instagram.com/v1/users/self/?access_token=' + cfg.access_token
    }
    request.get(userInfo, function(error, response, body){
      res.render('profile', {
        user : userInfo.data,
        layout : 'auth_base'
      })
    })
  }
})

module.exports = router
