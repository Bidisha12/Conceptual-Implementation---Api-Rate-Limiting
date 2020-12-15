const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const posts=require('./initialData')
const port = 9000

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here
let noOfAPICalls = 0;
let initialMax =null;
app.get('/api/posts', (req,res)=>{
    if(noOfAPICalls >= 5)
    {
        res.status(429).send({message: "Exceed Number of API Calls"});
        return;
    }
    const parsedMax= Number(req.params.max || 10);
    const max= parsedMax < 20 ? parsedMax : 10;
    let finalMax=max;

    if(initialMax !== null)
    {
        finalMax= Math.min(finalMax,initialMax);
    }
    const topMax= posts.filter((value,idx)=> idx < finalMax);
    res.send(topMax);

    if(initialMax === null)
    {
        initialMax = max;
        noOfAPICalls++;
        setTimeout(()=>{
            initialMax = null;
            noOfAPICalls = 0;
        }, 30*1000);
    }
    else{
        noOfAPICalls++;
    }
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
