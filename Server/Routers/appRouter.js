/*
This module routes requests that have to do with the homepage
*/
const cluster = require('cluster');
var express = require('express');
var app = module.exports = express();
var ehbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var appGlobalData = require('../../appGlobalData').appGlobalData; //shared preferences
var queriesModule = require('../../Database/queries');
var session = require('../../Database/sessions').session;
var sessionConfig = require('../../Database/sessions').sessionConfig;
var sessionStore = require('../../Database/sessions').sessionStore;

//set view engine
app.engine('hbs', ehbs({extname: 'hbs'}));
app.engine('ejs', cons.ejs);
app.set('views', path.join(appGlobalData.rootDir, '/Client/Views'));
app.set('view-engine', 'hbs');
app.set('view-engine', 'ejs');
app.enable('view cache');

//Set up a router
var routerOptions = {
    caseSensitive : true,
    mergeParams : false,
    strict : false
}
var router = express.Router(routerOptions);
//set up database session storage


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session(sessionConfig));
app.use(router);//mount the router to the app

//Route the requests =======================================
router.get("/", function(request, response){   
    if(!appGlobalData.sessionsEnabled){ //if sessions are disabled
        response.render("homeNoSession.hbs");
    }
    else{
        response.render("home.hbs");
    }
});

//Handles ajax log in request
router.post("/logIn", function(request, response){
    if(!appGlobalData.sessionsEnabled){ //if sessions are disabled
        response.status(200).send("OK");  
    }
    else{
        //check if session exists in the store
        sessionStore.get(request.session.id, (error, session)=>{
            if(error){ //error in session store
                response.status(500).send("Error when looking for session");
            }
            else{
                if(!session){ //No user is logged in
                    let username = request.body.username_;
                    let password = request.body.password_;
                    queriesModule.logIn(request, response, sessionStore, username, password);
                }
                else{ //User already logged in
                    response.status(200).send("OK");  
                }
            }
        });
    }
});

//Handles ajax Sign Up request
router.post("/register", function(request, response){
    console.log(`Fibonacci request sent to worker ${cluster.worker.process.pid}`);
    if(!appGlobalData.sessionsEnabled){
        response.status(200).send("OK");  
    }
    else{
        //check if session exists in the store
        sessionStore.get(request.session.id, (error, session)=>{
            if(error){ //error in session store
                response.status(500).send("Error when looking for session");
            }
            else{
                if(!session){ //no user logged in
                    let data = {
                        first_name : request.body.first_name_,
                        last_name : request.body.last_name_,
                        username : request.body.username_,
                        password : request.body.password_
                    }
                    queriesModule.register(request, response, sessionStore, data);
                }
                else{ //A user is already logged in
                    response.status(200).send("OK");    
                }
            }
        });
    }
});


//Route the requests =======================================
router.get("/calculations", function(request, response){  
    if(!appGlobalData.sessionsEnabled){
        response.status(200).render("calculationsNoSession.hbs");
    }
    else{       
        sessionStore.get(request.session.id, (error, session)=>{
            if(error){ //error in session store
                response.status(500).render("error505.hbs");                
            }
            else{
                if(!session){ //no session exists
                    response.status(200).render("loggedOut.hbs");                   
                }
                else{ //user logged in
                    response.status(200).render("calculations.hbs", {first_name : request.session.first_name, username : request.session.username});
                }
            }
        });
    }
});

router.get("/logOut", function(request, response){
    //console.log(`AdHocEd request sent to worker ${cluster.worker.process.pid}`);
    if(!appGlobalData.sessionsEnabled){
        response.status(200).render("loggedOut.hbs");
    }
    else{
        //check if session exists in the store
        sessionStore.get(request.session.id, (error, session)=>{
            if(error){ //error in session store
                response.status(500).send({message : "Error when looking for session"});
            }
            else{
                if(session){ //user logged in
                    sessionStore.destroy(request.session.id, (error)=>{ //kill the session
                        if(!error){
                            request.session.destroy((error)=>{
                                response.status(200).render("loggedOut.hbs");
                            });
                        }
                        else{
                            response.status(500).send("Failed to destroy session from store");
                        }
                    });
                }
                else{ //no session exists
                    request.session.destroy(()=>{
                        response.status(200).render("loggedOut.hbs");
                    });
                }
            }
        });
    }
});


router.get("/deleteAcc", function(request, response){
    //console.log(`AdHocEd request sent to worker ${cluster.worker.process.pid}`);
    if(!appGlobalData.sessionsEnabled){
        response.status(200).render("loggedOut.hbs");
    }
    else{
        //check if session exists in the store
        sessionStore.get(request.session.id, (error, session)=>{
            if(error){ //error in session store
                response.status(500).send({message : "Error when looking for session"});
            }
            else{
                if(session){ //user logged in
                    queriesModule.deleteAccount(request, response, session, sessionStore);
                }
                else{ //no session exists
                    request.session.destroy(()=>{
                        response.status(200).send("Already Out"); 
                    });
                }
            }
        });
    }
});
