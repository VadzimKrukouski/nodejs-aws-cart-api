import {CdkStack} from "./cdk-stack";
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

const app = new cdk.App();

new CdkStack(app,
    "CartCdkStack", {
        env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
        },
    });

app.synth();