const express = require('express');
const app = express();
// Import the axios library, to make HTTP requests
const axios = require('axios')

app.set('view engine', 'ejs');
var access_token = "";

// This is the client ID and client secret obtained when registering the app
const clientSecret = 'YOUR_CLIENT_SECRET';
const clientID = 'YOUR_CLIENT_ID';

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`App listening at http://localhost:${port}`));

// Callback route setup in my Github app
app.get('/login', (req, res) => {

  // The req.query object
  const requestToken = req.query.code
  
  //Gighub oauth
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

// redirect the user to the success page, along with the access token
app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/success',{ userData: response.data });
  })
});