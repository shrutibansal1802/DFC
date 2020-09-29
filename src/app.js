require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');

require('./db/mongoose');
const donorRouter = require('./routers/donor');
const ngoRouter = require('./routers/ngo');
const eventRouter = require('./routers/event');

const PORT = process.env.PORT || 5000;

const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "../client/templates/views");
const partialsPath = path.join(__dirname, "../client/templates/partials");

app.set("view engine", "ejs");

app.use(express.static(publicDirectoryPath));
app.use(bodyparser.urlencoded({ extended: false }))

app.use(express.json());
app.use(cors())
app.use(cookieparser());
app.use(donorRouter);
app.use(ngoRouter);
app.use(eventRouter);
app.get('/help', (req, res)=>{
    res.render('help', {
        donor: null,
        ngo:null
    })
});
app.get('/contactus', (req, res)=>{
    res.render('contactus', {
        donor: null,
        ngo:null
    })
});
app.get('*', (req, res)=>{
    res.render('404')
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});