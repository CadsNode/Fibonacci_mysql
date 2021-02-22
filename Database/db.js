var mysql = require('mysql');
var con = mysql.createPool({ 
   host : 'localhost',  
   user : 'root',     
   password : '',
   database : 'fibonacci'
});
con.getConnection(function(err){
   console.log("MySQL DB connection succeeded");
});

module.exports=con;

