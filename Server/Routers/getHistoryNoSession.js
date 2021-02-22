var express = require('express');
var router  = express.Router();
var db      = require('../../Database/db');
var app = module.exports = express();


router.use(function(req,res){             
    var username =  'none' 
      db.query("SELECT * from `calculations` WHERE `username` = '"+username+"' ORDER BY `creation` DESC",function(err,row){
   
      if(err)
        throw err;
      else
      {
        res.render('getHistory.hbs',{
           strcodes:row
        });
      }
     });
       
});

module.exports = router;
