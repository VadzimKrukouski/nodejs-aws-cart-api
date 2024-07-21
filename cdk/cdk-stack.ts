import * as cdk from 'aws-cdk-lib'
import {Construct} from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import {config} from 'dotenv'

config()

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const environment = {
            DATABASE_HOST: process.env.DATABASE_HOST!,
            DATABASE_PORT: process.env.DATABASE_PORT!,
            DATABASE_USERNAME: process.env.DATABASE_USERNAME!,
            DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
            DATABASE_NAME: process.env.DATABASE_NAME!,
        }

        console.log("Environments:" + environment.DATABASE_HOST)

        const cartLambda = new lambda.Function(this, 'CartApiLambda', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'bundle.handler',
            code: lambda.Code.fromAsset('../dist'),
            timeout: cdk.Duration.seconds(300),
            environment: environment,
        })

        const api = new apigateway.LambdaRestApi(this, 'CartApi', {
            handler: cartLambda,
            proxy: true,
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: ['Content-Type', 'Authorization'],
            },
        })

        new cdk.CfnOutput(this, 'cart', {
            value: api.url,
        })
    }
}