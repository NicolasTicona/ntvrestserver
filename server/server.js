require('./config/config')

const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
// Parse application/json
app.use(bodyParser.json())


// Assets
app.use(express.static(path.resolve(__dirname, '../public')))

// Routes
app.use(require('./routes/index'))

// Connection DB
mongoose.connect(process.env.urlDB, { useNewUrlParser: true}, (err, res) => {

    if (err) throw err

    console.log('DataBase Online')
})

app.listen(process.env.PORT , () => {
    console.log('Lintenning on port ',process.env.PORT)
})