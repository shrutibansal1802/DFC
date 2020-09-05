require('dotenv').config();
const express = require('express');
const app = express();
require('./db/mongoose');
const donorRouter = require('./routers/donor');
const ngoRouter = require('./routers/ngo');
const eventRouter = require('./routers/event');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(donorRouter);
app.use(ngoRouter);
app.use(eventRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});