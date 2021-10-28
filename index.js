//step-1
const express = require("express");
const cors = require('cors');
//step-13 korar time e
const ObjectId = require('mongodb').ObjectId;
//step-6
const { MongoClient } = require('mongodb');

//step-8 - npm i dotenv..then environment var add for security
require('dotenv').config()

//step-2
const app = express();

// middleware

app.use(cors());
app.use(express.json());

//step-3
const port = process.env.PORT || 5001;

//step-7
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cidqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

//step-9 
async function run() {
    try {
        await client.connect();
        //step-10
        //creating database or add existing database
        const database = client.db('carMechanic');
        //create a collection because there can be lot of infos
        const servicesCollection = database.collection('services');

        //step-12 Create a GET API to load data(frontend e)
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //step-13 Create another get api to show single service on the UI service detail
        //need to use dynamic route
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("getting services id", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //step-11 - Create a POST API to send datas to the database through server

        app.post('/services', async (req, res) => {
            //client e j UI ase okhane j data gula add koresi shegula req.body hishebe eshe ekta variable e store hocche
            const service = req.body;

            console.log("hit the post api", service);

            //ekhon result tar moddhe documention onujayi req e asha data add kre diccchi..and sheta k json hishebe response dicchi mongodb te
            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result);
        })

        //step-14 DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedService = await servicesCollection.deleteOne(query);
            res.json(deletedService);
        })

        //step-15 UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    description: updatedService.description,
                    price: updatedService.price,
                    image: updatedService.image,
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            console.log('updating user', req);
            res.json(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

//step-4
app.get('/', (req, res) => {
    res.send("Running Genius Server")
})
app.get('/', (req, res) => {
    res.send("Hello Updated Here")
})

//step-5
app.listen(port, () => {
    console.log("Running Genius Server on port", port);
})