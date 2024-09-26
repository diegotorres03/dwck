#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { DwckInfraStack } from '../lib/dwck-infra-stack'

const app = new cdk.App()
new DwckInfraStack(app, 'DevArchyStackProd', {
  env: {
    // account: '123456789012', 
    region: 'us-east-1'
  },
  domainName: 'dwck.dev-archy.com',
  certArn: 'arn:aws:acm:us-east-1:905418338837:certificate/04a50b00-cb01-4ca2-b566-465c8c85c335',
  hostedZoneId: 'Z03499403A5GA5MZQP82V'
})

new DwckInfraStack(app, 'DevArchyStackDev', {
  env: {
    // account: '123456789012', 
    region: 'us-east-1'
  },
  // domainName: 'dwck-alpha.dev-archy.com',
  // certArn: 'arn:aws:acm:us-east-1:905418338837:certificate/04a50b00-cb01-4ca2-b566-465c8c85c335',
  // hostedZoneId: 'Z03499403A5GA5MZQP82V'
})
