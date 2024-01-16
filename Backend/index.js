const connectToMongo = require('./db');
const express = require('express')
const app = express()

connectToMongo();
const port = 3001

app.use(express.json());
//
// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/auth', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`)
})
