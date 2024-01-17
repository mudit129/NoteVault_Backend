const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000

const connectToMongo = require('./db');

connectToMongo();


app.use(express.json())
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.get('/', (req, res) => {
  res.send('Hello Mudit!')
})



app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})