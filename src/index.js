'use strict';

const newman = require('newman');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

let mailTransport;

newman
  .run({
    collection: require('../collection.json'),
    environment: require('../run-env.json'),
    delayRequest: 500,
    reporters: 'cli'
  })
  .on('start', function(err, args) {
    // on start of run, log to console
    console.log('running a collection...');
  })
  .on('done', function(err, summary) {
    if (summary.run.failures.length > 0) {
      processFailures(summary.run.failures);
    }

    if (err || summary.error) {
      console.error('collection run encountered an error.');
    }

    console.log('collection run completed.');
  });

function processFailures(failures) {
  const properties = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, '..', '/gcloud-env.yaml'), 'utf8')
  );

  const email = new Email({
    message: {
      from: properties['email-account']
    },
    transport: getMailTransport(properties)
  });

  email
    .send({
      template: path.join(__dirname, 'emails', 'failure'),
      message: {
        to: properties.developers
      },
      locals: {
        failures: failures
      }
    })
    .then(console.log)
    .catch(console.error);
}

function getMailTransport(properties) {
  if (!mailTransport) {
    mailTransport = nodemailer.createTransport({
      auth: {
        pass: properties['email-password'],
        user: properties['email-account']
      },
      service: 'gmail'
    });
  }

  return mailTransport;
}
