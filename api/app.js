const express = require('express')
const loader = require('express-load')
const compression = require('compression')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(
    'mongodb://127.0.0.1/registers',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        useCreateIndex: true,
        useFindAndModify: false
    }
)

const app = express()
const http = require('http').Server(app)

app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(compression())
app.use(cors())

const register = {
    name: String,
    profession: String,
    address: String,
    birthdate: Date,
    created: { type: Date, default: Date.now },
}
const model = mongoose.model('register', register)

app.get('/register', async (req, res) => {
    try {
        let r = await model.find()
        res.json({ status: 'OK', registers: r })
    } catch {
        res.json({ status: 'FAIL' })
    }
})

app.post('/register', async (req, res) => {
    try {
        let reg = new model(req.body)
        reg.save()
        res.json({ status: 'OK' })
    } catch {
        res.json({ status: 'FAIL' })
    }
})
app.put('/register', async (req, res) => {
    try {
        let reg = await model.findOne({ _id: req.body._id })
        reg.name = req.body.name,
            reg.profession = req.body.profession,
            reg.address = req.body.address,
            reg.birthdate = req.body.birthdate,
            reg.save()
        res.json({ status: 'OK' })
    } catch {
        res.json({ status: 'FAIL' })
    }
})
app.delete('/register/:_id', async (req, res) => {
    try {
        model.deleteOne({ _id: req.params._id }, function (err) {
            if (err) return handleError(err);
            res.json({ status: 'OK' })
        });
    } catch {
        res.json({ status: 'FAIL' })
    }
})

http.listen(2000, () => {
    console.log(`Server listen on port 2000`)
})