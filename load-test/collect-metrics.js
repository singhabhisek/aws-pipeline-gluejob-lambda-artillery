const { getLambdaMetrics } = require("./metrics");
const fs = require("fs");

async function main() {
  const functions = ["insertDemographicsToDDB", "demographics-lambda-worker"];
  let report = {};

  for (const fn of functions) {
    const metrics = await getLambdaMetrics(fn, 60);
    report[fn] = metrics;
  }

  fs.writeFileSync("cloudwatch-metrics.json", JSON.stringify(report, null, 2));
  console.log("✅ CloudWatch metrics saved to cloudwatch-metrics.json");
}

main().catch(console.error);
