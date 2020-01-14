const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://amaithi24:B97nL8324ZXZAm3hu7Q8rGxKSUzQmeh78KIiwrzHE6dxJLH7XzNJMvtWrxYMTWYav2MvazK5bit1LwefI0DoBQ%3D%3D@amaithi24.documents.azure.com:10255/?ssl=true";
var dateFormat = require('dateformat');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());




app.get('/', (req, res) => {

    MongoClient.connect(url, function(err, db) {
        console.log("sds");
        if (err) throw err;
        var dbo = db.db("familiesdb");
        dbo.collection("families").findOne({}, function(err, result) {
            if (err) throw err;
            console.log(result);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
             res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');    
          
    res.send(result);
          });
        });

});




app.post('/view', (req, res) => {
    console.log(req);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("familiesdb");
        dbo.collection("families").findOne({}, function(err, result) {
            if (err) throw err;
            var dataSource;
            var matchTime;
            var date = new Date();
            date.setDate(date.getDate()-7);
            var dateF = dateFormat(date, "yyyy-mm-dd H");
            if(result !=null){
                    dataSource = result.inputData.findIndex(function(data){return(data.dataSource==req.body.dataSource)})
                if(dataSource != -1){
                    matchTime = result.inputData[dataSource].readingTemperature.findIndex(function(data){return(data.createtime.split(":")[0] == dateF && data.macAddress == req.body.macAddress)});
                   
                }else{
                    return false;
                }
               
            }
            var response=[{}];
            response[0].dataSource = (dataSource!=-1 ?true :false);
            response[0].date_macaddress_found =(matchTime!=-1 ?true:false);
            response[0].result=[];
            if(dataSource!=-1 && matchTime!=-1){           
                var found = result.inputData.splice(dataSource,1);
                result.inputData=[];
                result.inputData.push(found[0]);
                var shiv=result.inputData[0].readingTemperature[matchTime]
                result.inputData[0].readingTemperature = [];
                result.inputData[0].readingTemperature.push(shiv);
                response[0].result.push(result.inputData);
            }
         //   var data = result.inputData;

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
             res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');    
          
    res.send(response);
          });
        });

});




app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});