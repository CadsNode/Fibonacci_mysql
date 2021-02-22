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
    var user =  req.session.username 
     db.query("SELECT * from `calculations` WHERE `username` = '"+user+"'",function(err,row){
   
      if(err)
        throw err;
      else
      {
        var index = row.length-1;
           var out = {
             output:row[index].output.toString('utf8'),
             time:row[index].execution_time,
             memory:row[index].memory,
             verdict:row[index].verdict
           };
        res.send(JSON.stringify(out));
      }
     });
   });    
});

module.exports = router;