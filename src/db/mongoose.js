const mongoose =require('mongoose');
const uri = process.env.MONGO_URI;

mongoose.connect('mongodb://127.0.0.1:27017/donorforhelp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB database connection established successfully!")
});
