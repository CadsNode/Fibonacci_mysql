function getHistory() {	
  $.ajax({
      async: true,
      url: '/getHistory',
      contentType: "application/json",
      type: "GET",      
      success : function(response, status, XMLHttpRequest){                    
                window.location.href = "/getHistory";
            } 

    });   
}

//helper

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
