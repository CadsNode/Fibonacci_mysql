/* 
Main file/Starting point of the application
*/
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const port = 3000;

//We create as many workers as the cpus on the machine to run the main app
//They all share the same port
if (cluster.isMaster) {
    console.log("Fibonacci application started at port "+port+" ..");
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    var express = require('express');
    var app = express();
    var path = require('path');
    var hbs = require('express-handlebars');
    var Handlebars = require('handlebars');
    var HandlebarsIntl = require('handlebars-intl');
    var cons = require('consolidate');
    var appRouter = require('./Server/Routers/appRouter'); 
    var calcFibonacci = require('./Server/Routers/calcFibonacci');
    var calcFibonacciNoSession = require('./Server/Routers/calcFibonacciNoSession');
    var getOutput     = require('./Server/Routers/getOutput');
    var getOutputNoSession     = require('./Server/Routers/getOutputNoSession');
    var getHistory     = require('./Server/Routers/getHistory');
    var getHistoryNoSession     = require('./Server/Routers/getHistoryNoSession');

    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
     
    //set view engine
    HandlebarsIntl.registerWith(Handlebars);
    app.engine('hbs', hbs({extname: 'hbs'}));
    app.engine('ejs', cons.ejs);
    app.set('views', __dirname + '/Client/Views');
    app.set('view-engine', 'hbs');
    app.set('view-engine', 'ejs');
    app.enable('view cache');

    //load static files 
    // app.use('/fonts', express.static(path.join(__dirname,'/Client/Fonts')));
    app.use('/imgs',express.static(path.join(__dirname,'/Client/Images')));
    app.use('/css',express.static(path.join(__dirname,'/Client/Css')));    
    app.use('/js',express.static(path.join(__dirname,'/Client/JavaScript')));
    app.use(express.static(path.join(__dirname, 'public/inputs')));
    
    //mount routers
    app.use(appRouter); 
    app.use('/calcFibonacci',calcFibonacci);  
    app.use('/calcFibonacciNoSession',calcFibonacciNoSession); 
    app.use('/getOutput',getOutput);
    app.use('/getOutputNoSession',getOutputNoSession);
    app.use('/getHistory',getHistory);
    app.use('/getHistoryNoSession',getHistoryNoSession);   

    //start a Web Server at some port
    app.listen(port, function(){
       console.log(`Fibonacci worker ${cluster.worker.process.pid} online`);
    });
}