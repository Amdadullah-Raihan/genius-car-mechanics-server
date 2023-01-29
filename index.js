const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')


const port = 5000;
const app = express();

//middleware starts
app.use(cors())
app.use(express.json())
//middleware ends

//mongodb starts
//connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xplq2xb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//insert data
async function run(){
    try{
        await client.connect();
        console.log('Connected to database');
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');

        //GET API /services
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services)

        })

        //POST API 
        app.post('/services', async(req, res)=>{
            console.log('hitting post api')
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
//mogngo db ends

app.get('/', (req, res) =>{
    res.send("Runnning Genius Car Server")
})

app.listen(port, () =>{
    console.log('Lestening Genius Car Server on Port', port);
})