'use strict';

const newman = require('newman');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const mg = require('nodemailer-mailgun-transport');
const { Storage } = require('@google-cloud/storage');

let mailTransport;

newman
  .run({
    collection: require('../collection.json'),
    environment: require('../run-env.json'),
    delayRequest: 0,
    reporters: ['cli', 'html'],
    reporter: {
      html: {
        export: './results/report.html',
        template: './reporter-template.hbs'
      }
    }
  })
  .on('start', function(err, args) {
    // on start of run, log to console
    console.log('running a collection...');
  })
  .on('done', async (err, summary) => {
    await publishReport(!summary.run.failures.length > 0);

    if (summary.run.failures.length > 0) {
      await processFailures(summary);
      process.exit(1);
    }

    if (err || summary.error) {
      console.error('collection run encountered an error.');
      process.exit(1);
    }

    console.log('collection run completed.');
  });

function processFailures(summary) {
  const properties = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, '..', 'gcloud-env.yaml'), 'utf8')
  );

  console.log(JSON.stringify(properties));

  const email = new Email({
    message: {
      from: `${properties.from}@${properties.domain}`
    },
    transport: getMailTransport(properties)
  });

  return email
    .send({
      template: path.join(__dirname, 'emails', 'failure'),
      message: {
        to: properties.developers
      },
      locals: {
        report: 'https://storage.cloud.google.com/bookit-integration-test-runner-output/report.html'
        collection: summary.collection.name,
        executions: summary.run.executions.length,
        failures: summary.run.failures,
        timings: summary.run.timings
      }
    })
    .then(console.log)
    .catch(console.error);
}
function getMailTransport(properties) {
  const auth = {
    auth: {
      api_key: properties.apikey,
      domain: properties.domain
    }
  };

  if (!mailTransport) {
    mailTransport = nodemailer.createTransport(mg(auth));
  }

  return mailTransport;
}

async function publishReport(success) {
  // Publish the function to cloud storage
  const storage = new Storage();
  const bucket = storage.bucket('bookit-integration-test-runner-output');
  const iconFilePath = success
    ? path.join(__dirname, '/../icons/passing.svg')
    : path.join(__dirname, '/../results/failing.svg');

  return Promise.all([
    bucket.upload(path.join(__dirname, '/../results/report.html')),
    bucket.upload(iconFilePath, { destination: 'badge.svg', public: true })
  ]);
}
