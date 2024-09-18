import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { PipeConstruct, WebAppConstruct } from 'devarchy-cdk'
// import * as sqs from 'aws-cdk-lib/aws-sqs';
export class DwckInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    // This is a CI/CD
    // const pipeline = new PipeConstruct(this, 'DwckPipeline')
    // const codeRepo = pipeline.createCodeRepository('dwck_infra')
    // pipeline.source(codeRepo)
    // pipeline.build(PipeConstruct.DEPLOY_CDK)

    const webapp = this.setupWebapp()
  }

  private setupWebapp() {
    const webapp = new WebAppConstruct(this, 'dwckWebapp')
    webapp.addAssets('./webapps/landing-page')
    webapp.addAssets('../demos', 'demos')
    webapp.addAssets('../lib', 'lib')
    // webapp.run('../', ['npm run build', 'cat package.json'])
    return { webapp }
  }
}
