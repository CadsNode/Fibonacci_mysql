var express = require('express');
var router  = express.Router();
var db      = require('../../Database/db');
var app = module.exports = express();
var session = require('../../Database/sessions').session;
var sessionConfig = require('../../Database/sessions').sessionConfig;
var sessionStore = require('../../Database/sessions').sessionStore;
app.use(session(sessionConfig));

router.use(function(req,res){
  sessionStore.get(req.session.id, (error, session)=>{
      if(error){ 
        res.status(500).render("error505.hbs");
      }       
    var username =  req.session.username 
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
});


module.exports = router;
