const express = require("express");
const server = express();
const AWS = require('aws-sdk');
const url = require('url');
const port = process.env.PORT || 3200;

// run this api appliation on the above specified port and log out on console.
server.listen(port, () => {
  console.log(`running at port ${port}`);
});

//IAM user credentials
var credentials = {
	accessKeyId: "put access keyid here",
	secretAccessKey: "put secret accesskey here"
};

AWS.config.update({
	credentials: credentials,
	region: 'ap-south-1'
});

////get request

var presignedGETURL;

// this is the getSignedUrl api endpoint which receives the filename and returns back the signed url
server.get('/getSignedUrl', function(req, res) {
  try {
    const reqUrl = url.parse(req.url, true);
		let bucektParams = {
			Bucket: 'bucketname'
      Key: reqUrl.query.name,       //Parse the file name from URL
      Expires: 60*60 ,		//Time of expiry of signed URL
      ACL: 'bucket-owner-full-control'
		}
		var s3 = new AWS.S3();
		presignedGETURL = s3.getSignedUrl('putObject', bucektParams);
		console.log("presigned url obtained from s3: ", presignedGETURL);
    res.status(200).send(presignedGETURL);
  }
  catch (err) {
		console.log("error call during call s3 ".concat(err))
		throw err;
  }
})
