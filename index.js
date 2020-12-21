const express = require('express')
const app = express()
const port = 5000
const setting = require('./setting.json')

const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://ryuk:${setting.password}@ryuk-backend.fzdo5.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log("MongoDB Connected.."))
  .catch(error => console.log(error))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})