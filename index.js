const { timeStamp } = require('console')
const express = require('express')
const DataStore = require('nedb')
const path = require('path')
const fs = require('fs')
const { MongoClient } = require('mongodb'); 
const https = require('https');
const http = require('http');
const cors = require('cors')
let offmUrl = 'mongodb://127.0.0.1:27017'
let db, buyerscoll, sellerscoll
let coll_array = ['buyers', 'sellers']
let onmURL = 'mongodb+srv://stephenmatthew283:OaUEX4wVxl6gwNe3@tfa.p4bsc.mongodb.net/'

const app = express()
const port = 3001

const credentials = {}
 
app.use(express.json({limit: '1mb'}));
// serving statics  ie html, css and js
app.use(express.static('public'));app.use(cors());

//app.listen(port, '0.0.0.0',() => {console.log(`listening on port ${port}`)})
http.Server(app).listen(port, () => {console.log(`HTTPS server running on https://localhost:${port}`);});


const database = new DataStore('database.db')
database.loadDatabase()

app.post('/api', (req, res) => {
    // decomposing body
    const data = req.body; 
    data.timestamp = Date.now()
    database.insert(data)
    res.json(data);
});

app.get('/api', (req, res)=>{
    database.find({}, (err, data) => {
        if (err) {
            res.end()
            return
        }
        res.json(data)}
    )
})

async function initDb(){
    const client = new MongoClient(onmURL)
    await client.connect()
    db = client.db('users')
    buyerscoll = db.collection(coll_array[0])
    sellerscoll = db.collection(coll_array[1])

    replacedb(buyerscoll, {name:'steve'}, {name:'steve', cost: '5dolls'})
    // finddb(buyerscoll, {name: 'steve'}, console.log)
    // insertdb(buyerscoll, {name: 'steve', cost: '2dolls'})

    console.log('database connected successfully')
}

function newuser(o){
    finddb(buyerscoll,{name:o.name},myf1);function myf1(v){if(v.length){}else{encryptme(o,myf2)};};function myf2(v){insertdb(buyerscoll,v);}
}

function insertdb(col,n){
    col.insertOne(n);console.log('data inserted successfully')
}

async function finddb(col,o,callback){
    const data =await col.find(o).toArray()
    callback(data)
}

function replacedb(col,o,n){
    col.findOneAndReplace(o,n)
    console.log('data updated')
}

function deletedb(col,o){
    col.findOneAndDelete(o)
    console.log('deleted sucessfully')
    console.log(o[0])
}