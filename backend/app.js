require('dotenv').config();
const express = require('express');
const app = express();
require('./db/mongoose');
const donorRouter = require('./routers/donor');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(donorRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});