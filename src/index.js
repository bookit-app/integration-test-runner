'use strict';

const newman = require('newman');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const mg = require('nodemailer-mailgun-transport');

let mailTransport;

newman
  .run({
    collection: require('../collection.json'),
    environment: require('../run-env.json'),
    delayRequest: 250,
    reporters: 'cli'
  })
  .on('start', function(err, args) {
    // on start of run, log to console
    console.log('running a collection...');
  })
  .on('done', async (err, summary) => {
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
