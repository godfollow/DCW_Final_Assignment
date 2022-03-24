const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 8080
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const mysql = require('mysql2');
// const mongodb = require('mongodb');
app.use(cors())

// create the connection to database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'demons',
    password: 'Mon991912!',
    database: 'dcw_db'
    
});

app.post('/api/login_with_google', bodyParser.json(), async (req, res) => {
    let token = req.body.token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload(); 
    connection.query(
        `INSERT INTO TABLE (Email) VALUES(${email}) ON DUPLICATE KEY UPDATE Email = ${email}`,
        function(err, results, fields) {
          console.log(results); // results contains rows returned by server
          console.log(fields); // fields contains extra meta data about results, if available
        }
    );
    // const user = await db.user.upsert({ 
    //     where: { email: email },
    //     update: { name, picture },
    //     create: { name, email, picture }
    // })
    // const user = {
    //     name: name,
    //     email: email,
    //     picture: picture
    // }
    // console.log(user.id)

    res.send(user)

})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
