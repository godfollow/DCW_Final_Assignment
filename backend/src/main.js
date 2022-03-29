const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken');
const app = express()
const port = 8080
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const mysql = require('mysql2');
// const mongodb = require('mongodb');
app.use(cors())


const TOKEN_SECRET = 'b4b30dc316d49151c522a8aef459292791c17d8314ce9f8e0e523df6caa4ed606fdd18292bad9448e317fc6b2cba046f4520d744c24b1cdf096f72b059dcd2c8'

const authenticated = (req, res, next) => {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split(' ')[1]
    if(!token) 
        return res.sendStatus(401)
    jwt.verify(token, TOKEN_SECRET, (err, info) => {
        if(err) return res.sendStatus(403)
        req.user = info
        next()
    })
   
}


const insertOrUpdateDB = (email, name, picture) => {
    //check user email in db
    connection.query(
        `SELECT * FROM Users WHERE Email = '${email}'`,
        function (err, results, fields) {
            if(results[0]) {  //update data to db
                id = results[0]['Id'];
                connection.query(
                    `UPDATE Users SET Name='${name}', Picture='${picture}' WHERE Id=${id}`,
                    function (err, result, fields) {
                        
                    }
                )
                // console.log(id)
            }else if(!results[0]) { // insert data to db
                connection.query(
                    `INSERT INTO Users(Email, Name, Picture) VALUES ('${email}', '${name}', '${picture}')`,
                    function (err, result, fields) {
                        id = result['insertId'];
                        // console.log(id)
                    }
                )
            }
            
        }
    );
    
}

// create the connection to database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'admin',
    password: 'Admin1212',
    database: 'dcw_db'
    
});
//create table to db when start server if table doesn't exists
connection.query(
    'CREATE TABLE IF NOT EXISTS Users (Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, Email VARCHAR(255) NOT NULL, Name VARCHAR(255), Picture VARCHAR(2000))',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
);



app.post('/api/login_with_google', bodyParser.json(), async (req, res) => {
    let token = req.body.token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload(); 
    
    insertOrUpdateDB(email, name, picture);

    const user = {
        name: name,
        email: email,
        picture: picture
    }
    const access_token = jwt.sign(user, TOKEN_SECRET, {expiresIn: '20s'})
    const refresh_token = jwt.sign(user, TOKEN_SECRET, { expiresIn: '36000s'})
    res.send({access_token, refresh_token, user})

})

app.get('/api/info', authenticated, (req, res) => {
    res.send({ok: 1, user: req.user})
})


// app.post('/api/get_token', bodyParser.json(), (req, res) => {
//     const refresh_token = req.body.refresh_token
//     console.log(refresh_token)
// })

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
