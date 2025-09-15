const AWS = require("aws-sdk");
const cloudwatch = new AWS.CloudWatch({ region: "us-east-1" });

async function getLambdaMetrics(functionName, minutes = 10) {
  const now = new Date();
  const startTime = new Date(now.getTime() - minutes * 60 * 1000);

  const params = {
    StartTime: startTime,
    EndTime: now,
    MetricDataQueries: [
      {
        Id: "invocations",
        MetricStat: {
          Metric: { Namespace: "AWS/Lambda", MetricName: "Invocations", Dimensions: [{ Name: "FunctionName", Value: functionName }] },
          Period: 60,
          Stat: "Sum"
        }
      },
      {
        Id: "errors",
        MetricStat: {
          Metric: { Namespace: "AWS/Lambda", MetricName: "Errors", Dimensions: [{ Name: "FunctionName", Value: functionName }] },
          Period: 60,
          Stat: "Sum"
        }
      },
      {
        Id: "duration",
        MetricStat: {
          Metric: { Namespace: "AWS/Lambda", MetricName: "Duration", Dimensions: [{ Name: "FunctionName", Value: functionName }] },
          Period: 60,
          Stat: "Average"
        }
      },
      {
        Id: "maxMemoryUsed",
        MetricStat: {
          Metric: { Namespace: "AWS/Lambda", MetricName: "MaxMemoryUsed", Dimensions: [{ Name: "FunctionName", Value: functionName }] },
          Period: 60,
          Stat: "Average"
        }
      }
    ]
  };

  const data = await cloudwatch.getMetricData({ MetricDataQueries: params.MetricDataQueries, StartTime: params.StartTime, EndTime: params.EndTime }).promise();
  return data.MetricDataResults;
}

module.exports = { getLambdaMetrics };
