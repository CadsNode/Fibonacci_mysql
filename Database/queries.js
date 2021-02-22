var mysql = require('mysql');
var connectionPool = mysql.createPool({
    connectionLimit : 200,
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : '',
    database : 'fibonacci'
});

// Test 
connectionPool.getConnection((err)=>{
    if(!err)
        console.log('DB connection succeeded');
    else
        console.log('DB connection failed \n Error : '+ JSON.stringify(err, undefined,2));
})

var register = function(request, response, sessionStore, user){
    connectionPool.getConnection((err, connection)=>{
        if(err){
            console.log("Could not get connection from pool");
        }
        else{
            //First check if the user already exists
            let queryStr = "SELECT * FROM Users WHERE username=?";
            connection.query(queryStr, [user.username], function(err, rows){
                if(err){
                    connection.release();
                    response.status(500).send({message : "Internal database error."});
                }
                else{
                    if(rows.length != 0){
                        connection.release();
                        response.status(400).send({message : "User already exists."});
                    }
                    else{
                        //If the user doesn't already exist insert the data to the database
                        let queryStr = "INSERT INTO Users (first_name, last_name, username, password) VALUES (?,?,?,?);";
                        connection.query(queryStr, [user.first_name, user.last_name, user.username, user.password], function(err){
                            connection.release();
                            if(err){
                                response.status(500).send({message : "Internal database error."});
                            }
                            else{
                                request.session.first_name = user.first_name;
                                request.session.username = user.username;
                                sessionStore.set(request.session.id, request.session, function(){
                                    response.status(200).send("OK");
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};

var logIn = function(request, response, sessionStore, username, password){
    connectionPool.getConnection((err, connection)=>{
        if(err){
            console.log("Could not get connection from pool");
        }
        else{
            let queryStr = "SELECT * FROM Users WHERE username=? AND password=?;";
            connection.query(queryStr, [username, password], function(err,rows){
                connection.release();
                if(err){
                    response.status(500).send({message : "Internal database error."});
                }
                else{
                    if(rows.length != 0){
                        request.session.first_name = rows[0]["first_name"];
                        request.session.username = username;
                        sessionStore.set(request.session.id, request.session, function(){
                            response.status(200).send("OK");
                        });
                    }
                    else{
                        response.status(400).send({message : "User not found."});
                    }
                }
            });
        }
    });
};

var deleteAccount = function(request, response, session, sessionStore){
    connectionPool.getConnection((err, connection)=>{
        if(err){
            console.log("Could not get connection from pool");
        }
        else{
            let queryStr = "DELETE FROM Users WHERE username=? ;";
            connection.query(queryStr, [request.session.username], function(err,rows){
                connection.release();
                if(err){
                    response.status(500).send({message : "Internal database error."});
                }
                else{ //a user has been deleted, let's kill their session too
                    sessionStore.destroy(request.session.id, (error)=>{ //kill the session
                        if(!error){
                            request.session.destroy((error)=>{
                                response.status(200).send("Account deleted and logged out");
                            });
                        }
                        else{
                            response.status(500).send("Failed to destroy session from store");
                        }
                    });
                }
            });
        }
    });
};


module.exports.register = register;
module.exports.logIn = logIn;
module.exports.deleteAccount = deleteAccount;
