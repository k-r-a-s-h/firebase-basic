const express = require('express');
const app = express();
const path =require('path');

app.set('views',path.join(__dirname,'views'));
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.set("view engine","ejs");

const admin =require('firebase-admin');
const serviceAccount =  require('./sa.json');

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://basic-development.firebaseio.com"
})

app.get('/',(req,res)=>{
    res.send('Connected');
})

app.get('/login',(req,res)=>{
    res.render('index');
})


app.post('/login', async (req,res)=>{
    console.log('got the request');
    const idToken = req.body.idToken + '';
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await admin.auth().createSessionCookie(idToken,{expiresIn});
    const options = {maxAge: expiresIn, httpOnly: true, secure: false, domain: 'localhost'};
    res.cookie('session', sessionCookie, options);
    res.status(200).json({status: 'success'});
})

app.get('/protected',(req,res)=>{
    res.send('protected');
})

app.listen(process.env.PORT||3000,process.env.IP,()=>{
    console.log("The server has started");
})