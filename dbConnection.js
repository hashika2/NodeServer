const mongoose = require('mongoose');

function db (){
   // mongoose.connect('mongodb://localhost/mydb',console.log("mongodb connected"))
   const uri = "mongodb+srv://hashika:hashika@cluster0-qollh.mongodb.net/test?retryWrites=true&w=majority";
    mongoose.connect(uri,{useUnifiedTopology: true,useNewUrlParser: true})
    .then(()=>console.log("db is connected")).catch(()=>console.log("eror"))
}

exports.db = db;