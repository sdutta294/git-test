const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const lo = require('lodash');

const app = express();

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      //res.json("Not Found");
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', urlencodedParser, (req, res) => {
  // Mock user
  if(typeof (req.body.id) !== 'undefined')
  {
  const user = {
    id: req.body.id, 
    username: req.body.username,
    email: req.body.email
  }

  jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token
    });
  });
}
else
res.json("Please enter id, username and password!");
});

// FORMAT OF TOKEN
// Authorization: authPerson <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const authHeader = req.headers['authorization'];
  // Check if authPerson is undefined
  if(typeof authHeader !== 'undefined') {
    // Split at the space
    ////const authPerson = authHeader.split(' ');
    // Get token from array
    ////const authPersonToken = authPerson[0];
    // Set the token
    req.token = authHeader;//authPersonToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.listen(5111, () => console.log('Server started on port 5111'));