const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yzqnnly.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();



        const productCollection = client.db('heroHaven').collection('products');

        // app.get('/products', async (req, res) => {
        //     const cursor = productCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/products', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { seller_email: req.query.email }
            }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.post('/toy', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await productCollection.insertOne(newToy);
            res.send(result);
        })

        // app.patch('/products/:id', async (req, res) => {
        //     const productId = req.params.id;
        //     const updateToyDetails = req.body;

        //     try {
        //         const result = await productCollection.updateOne(
        //             { _id: new ObjectId(productId) },
        //             { $set: updateToyDetails }
        //         );

        //         if (result.modifiedCount > 0) {
        //             res.status(200).json({ message: 'Product details updated successfully' });
        //         } else {
        //             res.status(404).json({ error: 'Product not found' });
        //         }
        //     } catch (error) {
        //         res.status(500).json({ error: 'Failed to update product details' });
        //     }
        // });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateToyDetails = req.body;
            const toy = {
                $set: {
                    name: updateToyDetails.toy_name,
                    price: updateToyDetails.price,
                    picture_url: updateToyDetails.picture_url,
                    available_quantity: updateToyDetails.available_quantity,
                    description: updateToyDetails.description
                }
            }
            const result = await productCollection.updateOne(filter, toy, options);
            res.send(result)
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Avengers coming soon');
})

app.listen(port, () => {
    console.log(`Hero Haven server listening on ${port}`)
})