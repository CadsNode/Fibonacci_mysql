var express     = require('express');
var router      = express.Router();
var fs          = require('fs');
var db          = require('../../Database/db');
var path        = require('path');
var performance = require('perf_hooks').performance;
var pidusage    = require('pidusage');

router.use (function(req,res){
  var day   = new Date().getDate();
  var month = new Date().getMonth();
  var year  = new Date().getFullYear();
  var hour  = new Date().getHours();
  var min   = new Date().getMinutes();
  var sec   = new Date().getSeconds();
  var username  = req.body.username;
  var input = req.body.input;
  input     = input.replace(/\n/g, "\r\n");
  var op;
  var verdict;
  var execution_time=0;
    
    var dir = './public/inputs/'+username+'/';
    console.log("Directory created for User");

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);      
      fs.writeFileSync('./public/inputs/'+username+'/input.txt',input.toString());   
      var reqpath    = path.join(__dirname,'./public/inputs/');      
      var start      = performance.now(); 
      var phi = (1+Math.sqrt(5))/2;
      var child=Math.round(Math.pow(phi,input)/Math.sqrt(5));         
      var end        = performance.now();
      execution_time = (end-start);      
      if(child.toString().length!=0){
         op = child.toString();
         verdict = "Accepted";
      }
      else{
        verdict = "Calculation Error";
        
      } 
          

    ////////////////////////////
    }
    else{
  
     fs.writeFileSync('./public/inputs/'+username+'/input.txt',input.toString());   
      var reqpath    = path.join(__dirname,'./public/inputs/');       
      var start      = performance.now(); 
      var phi = (1+Math.sqrt(5))/2;
      var child=Math.round(Math.pow(phi,input)/Math.sqrt(5));         
      var end        = performance.now();
      execution_time = (end-start);      
      if(child.toString().length!=0){
         op = child.toString();
         verdict = "Accepted";
      }
      else{
        verdict = "Calculation Error";      
      } 
//////////////////////////////////
    }
          

  /////////////////////////////////   

console.log(op)
var cdate = year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec; 
var calculation={
  username:username,  
  input:input,
  creation:cdate,  
  verdict:verdict,
  execution_time:execution_time,
  memory:0,
  output:op
};
  
db.query('INSERT INTO calculations SET ?',calculation,function(error,results,fields){
  if(error)
    throw error;
  else
  {
    console.log("Calculation added");
    }
  });
});

module.exports = router;