import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { PipeConstruct, WebAppConstruct } from 'devarchy-cdk'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface DomainProps extends StackProps {
  domainName?: string
  certArn?: string
  hostedZoneId?: string
}

export class DwckInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: DomainProps) {
    super(scope, id, props)
    // This is a CI/CD
    // const pipeline = new PipeConstruct(this, 'DwckPipeline')
    // const codeRepo = pipeline.createCodeRepository('dwck_infra')
    // pipeline.source(codeRepo)
    // pipeline.build(PipeConstruct.DEPLOY_CDK)

    const webapp = this.setupWebapp(props?.domainName, props?.certArn, props?.hostedZoneId)
  }

  private setupWebapp(domainName?: string, certArn?: string, hostedZoneId?: string) {
    const webapp = new WebAppConstruct(this, 'dwckWebapp', {
      domainName: domainName,
      certArn:certArn,
      // @ts-ignore
      hostedZoneId: hostedZoneId,
    })

    webapp.addAssets('./webapps/landing-page')
    webapp.addAssets('../demos', 'demos')
    webapp.addAssets('../lib', 'lib')
    webapp.addAssets('../builds', 'builds')
    // webapp.run('../', ['npm run build', 'cat package.json'])
    return { webapp }
  }
}
