const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      massive = require('massive'),
      AWS = require('aws-sdk'),
      config = require('./config');

AWS.config.update({
  accessKeyId: config.aws.ACCESS_KEY,
  secretAccessKey: config.aws.SECRET_KEY,
  region: 'us-west-2'
});

const s3 = new AWS.S3();

const app = module.exports = express();

//node has a capacity on how much you can send to the server
//so this expands the server capacity
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('./public'));
app.use('/node_modules', express.static('./node_modules'));


app.post('/api/newimage', function(req, res, next) {
  console.log('hit post endpoint');
  const buf = new Buffer(req.body.imageBody.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  //replaces that bit with an empty string, and then tells it it's a base64 string


  //bucketName variable below creates a folder for each user
  const bucketName = 'austinhollenbaugh/' + req.body.userEmail;
  const params = {
    Bucket: bucketName,
    Key: req.body.imageName,
    Body: buf,
    ContentType: 'image/' + req.body.imageExtension,
    ACL: 'public-read' //what privacy you want
  }

  s3.upload(params, function(err, data) {
    console.log(err, data);
    if (err) return res.status(500).send(err);
    res.status(200).json(data); //save data to database?
  });

});

app.listen(3000, function() {
  console.log('Listening on 3000');
});
