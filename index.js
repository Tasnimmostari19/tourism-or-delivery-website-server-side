const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const objectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b1ws8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db("tourism");
        const tripCollection = database.collection("trips");
        const bookingCollection = database.collection("bookings");


        //find all
        app.get('/trips', async (req, res) => {
            console.log(req.query);
            const cursor = tripCollection.find({});
            const products = await cursor.toArray();
            res.json(products)
        })

        //find by id
        app.get('/trips/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting service', id);
            const query = { _id: objectId(id) };
            const trip = await tripCollection.findOne(query);
            res.json(trip)
        })


        //insert one
        app.post('/trips', async (req, res) => {

            const newUser = req.body;
            const result = await tripCollection.insertOne(newUser);

            console.log(req.body);
            console.log(result);
            res.json(result);
        });


        //add bookings
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            console.log('booking', booking);
            res.json(result);
        })


        // get mytrip
        // app.get('/bookings/:email', async (req, res) => {
        //     const email = req.params.email;
        //     console.log('getting service', email);
        //     const query = { email: email };
        //     const myTrip = await tripCollection.findOne(query);
        //     res.json(mtTrip)

        // })





    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello to the World tourism!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})