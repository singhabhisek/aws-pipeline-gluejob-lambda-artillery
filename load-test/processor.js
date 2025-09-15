const AWS = require("aws-sdk");
const faker = require("faker");
const s3 = new AWS.S3({ region: "us-east-1" });

module.exports = {
  uploadCsv: function (context, events, done) {
    const numRows = 500;
    let csv = "id,firstName,lastName,phone,email,address,zip\n";

    for (let i = 0; i < numRows; i++) {
      csv += `${i},${faker.name.firstName()},${faker.name.lastName()},${faker.phone.phoneNumber()},${faker.internet.email()},${faker.address.streetAddress().replace(/\n/g,' ')},${faker.address.zipCode()}\n`;
    }

    const key = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}.csv`;

    s3.putObject({
      Bucket: "demographics-csv-input",
      Key: key,
      Body: csv
    }, (err, data) => {
      if (err) return done(err);
      return done();
    });
  }
};
