const mongoose = require('mongoose');
// const mongoURI = "mongodb://127.0.0.1:27017/inotebook";
const mongoURI = "mongodb+srv://jainmudit127:mudit129@cluster0.amntujl.mongodb.net/inotebook?retryWrites=true&w=majority"

async function connectToMongo() {
    await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
}

module.exports = connectToMongo;