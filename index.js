#! /usr/bin/env node
"use strict";

// requires
let Table  = require('cli-table');
let colors = require('colors');
let fs     = require('fs');
let AWS    = require('aws-sdk');

// exit codes
const EXIT_NO_CONF      = 1;
const EXIT_INVALID_CONF = 2;
const EXIT_AWS_ERROR    = 3;

// opsworks only works with us-east-1
let opsworks = new AWS.OpsWorks({
    region: "us-east-1"
});

// ennsure we have a config file
if (process.argv[2] == undefined) {
    console.log('Please supply a config file.');
    process.exit(EXIT_NO_CONF);
}

// check that it is a file, load the file, get the stack ids
// and then check each instance in that stack
fs.stat(process.argv[2], (err, stats) => {
    if (err || !stats.isFile()) {
        console.log('Invalid config file');
        process.exit(EXIT_INVALID_CONF);
    }

    let config = require(process.argv[2]);
    let promises = config.stack_ids.map((stackId) => {
        return new Promise((resolve, reject) => {
            let params = { StackId: stackId };

            opsworks.describeInstances(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    });

    Promise.all(promises)
    .then(stacks => {
        var table = new Table({
            head: ['Instance', 'Status']
        });

        stacks.forEach((stack) => {
            stack.Instances.forEach((instance) => {
                let status;
                switch (instance.Status) {
                    case 'online':
                        status = instance.Status.green;
                        break;

                    case 'stopped':
                    case 'error':
                    default:
                        status = instance.Status.red;
                }
                table.push([instance.Hostname, status]);
            });
        });

        console.log(table.toString());
    })
    .catch((err) => {
        console.log('Unable to retrieve stack statuses.')
        process.exit(EXIT_AWS_ERROR);
    });
});
