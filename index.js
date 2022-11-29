const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
require('dotenv').config()
var jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    console.log(authHeader)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

// userName : sellDeDb
//password: aDBBl44kiwdMe9rM

app.get('/', (req, res) => {
    res.send('Sell de server is running')
})


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('sellDe').collection('users')
        const carCollection = client.db('sellDe').collection('cars')
        const bookingCollection = client.db('sellDe').collection('bookings')
        const adverticeCollection = client.db('sellDe').collection('advertice')
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = await userCollection.find(query).toArray()
            res.send(cursor)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'seller'
                },
            };
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.put('/users/valid/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    valid: 'validated'
                },
            };
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.put('/sellers/valid/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    valid: 'validated'
                },
            };
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.delete('/users/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/buyers/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.delete('/sellers/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.post('/cars', async (req, res) => {
            const car = req.body;
            const result = await carCollection.insertOne(car)
            res.send(result)
        })

        app.get('/cars', async (req, res) => {
            const query = {}
            const result = await carCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await carCollection.deleteOne(filter)
            res.send(result)
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category: id }
            const result = await carCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email

            const query = {
                email: email,
            }
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        app.get('/buyers', verifyJWT, async (req, res) => {
            const query = { role: 'buyer' }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/sellers', verifyJWT, async (req, res) => {
            const query = { role: 'seller' }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/bookings/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/car/advertice', async (req, res) => {
            const advertice = req.body;
            const result = await adverticeCollection.insertOne(advertice)
            res.send(result)
        })
        app.get('/car/advertice', async (req, res) => {
            const query = {};
            const result = await adverticeCollection.find(query).toArray()
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(err => console.log(err))
app.listen(port, () => console.log(`sell de server is running on port ${port}`))