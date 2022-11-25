const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    }
    finally {

    }
}
run().catch(err => console.log(err))
app.listen(port, () => console.log(`sell de server is running on port ${port}`))