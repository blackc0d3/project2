var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  //res.render('profile/profile');
  res.render('information');
});




module.exports = router;