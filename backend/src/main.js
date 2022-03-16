const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const app = express()
const port = 8080

const TOKEN_RECRET = '12c417aed054d2e9134c546472a984384d117a462e50b7c357aee1da52e461c2511f2e4af190c8112576d303a822b9540b88282f22d2573698f893efe2758c7f'

const authenticated = async (req, res, next) => {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split(' ')[1]
    if(!token)
        return res.sendStatus(401)
    jwt.verify(token, TOKEN_RECRET, (err, info) => {
        if(err) return res.sendStatus(403)
        req.username = info.username
        next()
    })
    
}

app.use(cors())

app.get('/api/info', authenticated, (req, res) => {
    res.send({ok: 1, username: req.username})
})

app.post('/api/login', bodyParser.json(), async (req, res) => {
    let token = req.body.token
    let result = await axios.get('https://graph.facebook.com/me', {
        params: {
            fields: 'id,name,email',
            access_token: token
        }
    })
    if(!result.data.id){
        res.sendStatus(403)
        return
    }
    let data = {
        username: result.data.email
    }
    let access_token = jwt.sign(data, TOKEN_RECRET, {expiresIn: '1800s'})
    res.send({access_token, username: data.username})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
