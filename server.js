var express = require('express');
var cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
var bodyParser = require('body-parser');

const CLIENT_ID = "f0c153b47154dbb6cf50";
const CLIENT_SECRET = "3c3d864879a5bafce2d89ea6c3253a17726bbdcb";

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken',async function(req,res) {
  const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      'ngrok-skip-browser-warning': 'true'
    }
  }).then((response)=>{
    return response.json();
  }).then((data)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.json(data);
  })
});

//get user data 

app.get('/getUserData', async function(req,res){
  await fetch("https://api.github.com/user",{
    method: "GET",
    headers:{
      "Authorization" : req.get("Authorization"),
      'ngrok-skip-browser-warning': 'true'
    }
  }).then((response) => {
    return response.json();
  }).then((data)=>{
    console.log(data);
    res.header('Access-Control-Allow-Origin', '*');
    res.json(data);
  })
})

app.listen(4000,function(){
  console.log("CORS server running on port 4000");
})