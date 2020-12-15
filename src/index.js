const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 3000
const posts=require('./initialData')
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
// your code goes here
let noOfAPICalls = 0;
let initialMax =null;
app.get('http://localhost:3000/api/posts', async (req,res)=>{

    if(noOfAPICalls >= 5)
    {
        res.status(429).send({message: "Exceed Number of API Calls"});
        return;

    }
    const parsedMax= await Number(req.params.max || 10);
    const max= parsedMax < 20 ? parsedMax : 10;
    const finalMax=max;

    if(initialMax !== null)
    {
        finalMax= Math.min(finalMax,initialMax);
    }
    const topMax= posts.filter((value,idx)=> idx < 10);
    res.send(topMax);

    if(initialMax === 0)
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
