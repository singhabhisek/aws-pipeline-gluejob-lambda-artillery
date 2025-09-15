const AWS = require("aws-sdk");
const { faker } = require("@faker-js/faker");
const s3 = new AWS.S3({ region: "us-east-1" });

function generateCsv(rows = 500) {
  let csv = "id,firstName,lastName,phone,email,address,zip\n";
  for (let i = 0; i < rows; i++) {
    csv += `${i},${faker.person.firstName()},${faker.person.lastName()},${faker.phone.number()},${faker.internet.email()},${faker.location.streetAddress().replace(/\n/g,' ')},${faker.location.zipCode()}\n`;
  }
  return csv;
}

module.exports = {
  uploadCsv: function (context, events, done) {
    const csv = generateCsv();
    const key = `test_${Date.now()}.csv`;

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
