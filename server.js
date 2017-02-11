console.log("hello world");

const express = require('express');
const MongoClient = require('mongodb').MongoClient
const app = express();




var db;

MongoClient.connect('mongodb://inyounghong:Feliciano7@ds131139.mlab.com:31139/archive', function(err, database){
    if (err) return console.log(err);
    db = database;
    app.listen(3000, function(){
        console.log('listening on 3000');

    });
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/overview', function(req, res) {
    res.sendFile(__dirname + '/overview.html');
});

app.get('/data', function(req, res) {
    db.collection("harry_potter")
    .aggregate([
        { "$unwind" : "$relationships" },
        { "$group" : {
            _id:"$relationships",
            count: {$sum: 1},
            // word_sum: {$sum: "$words"},
            // kudo_sum: {$sum: "$kudos"},
            // word_average: {$avg: "$words"},
            // kudo_average: {$avg: "$kudos"},
            }
        },
        { $sort: {count: -1}},
        { $limit: 50 }
    ]).toArray(function(err, results) {
    // db.collection('harry_potter').find().toArray(function(err, results) {
        console.log(results);
        res.send({
            nodes: results }
        );
    });
});

  // res.sendFile(__dirname + '/index.html')
