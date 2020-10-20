const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors())
const port = 5000

const USER_NAME = process.env.DB_USER;
const USER_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;


const uri = `mongodb+srv://${USER_NAME}:${USER_PASS}@cluster0.sfno3.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;


//console.log(process.env.DB_USER)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db(DB_NAME).collection("products");
    const ordersCollection = client.db(DB_NAME).collection("orders");
    // perform actions on the collection object
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })


    app.get("/products", (req, res) => {
        productsCollection.find({}).limit(20)
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    app.get("/product/:key", (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((error, documents) => {
                res.send(documents[0])
            })
    })

    app.post("/productsByKeys", (req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: { $in: productKeys } })
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount>0)
            })
    })



    ///client.close();
});






//Root Directory
app.get('/', (req, res) => {
    res.send('Hello ema-jhon-server!')
})

app.listen(port, () => {
    console.log(`Running app listening at http://localhost:${port}`)
})