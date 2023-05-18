const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Avengers coming soon');
})

app.listen(port, ()=>{
    console.log(`Hero Haven server listening on ${port}`)
})