const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// userName : sellDeDb
//password: aDBBl44kiwdMe9rM

app.get('/', (req, res) => {
    res.send('Sell de server is running')
})


const uri = "mongodb+srv://sellDeDb:aDBBl44kiwdMe9rM@cluster0.z1xe9fw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('sellDe').collection('users')
        const carCollection = client.db('sellDe').collection('cars')
        const bookingCollection = client.db('sellDe').collection('bookings')
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
        app.delete('/users/delete/:id', async (req, res) => {
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
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { category: id }
            const result = await carCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/users/role', async (req, res) => {
            const email = req.query.email
            const role = req.query.role;
            const query = {
                email: email,
                role: role
            }
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(err => console.log(err))
app.listen(port, () => console.log(`sell de server is running on port ${port}`))