function postNoSession() {	
  var input   = document.getElementById("value").value; 
  var username  = document.getElementById("user_id").value;  
  var output  = document.getElementById("output");    
  var ver     = document.getElementById("ver");
  var tim     = document.getElementById("tim");
  var mem     = document.getElementById("mem");
 
  $.ajax({
      url: '/calcFibonacciNoSession',
      type: 'POST',      
      data: {username:username, input:input},
      success: function(result){
        console.log("request sent to server");
      }
    });
   
  $.get("/getOutputNoSession", function(data) {
         var obj = JSON.parse(data);
         console.log(obj)         
         output.innerHTML=obj.output;
         ver.innerHTML=obj.verdict;
         tim.innerHTML=obj.time+" ms";
         mem.innerHTML=obj.memory+" KB";     
     });
  
}

//helper

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
