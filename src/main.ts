import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Handler, Context } from 'aws-lambda'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Server } from 'http'
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

let server: Server

async function bootstrap() {
  const expressApp = express()
  const expressAdapter = new ExpressAdapter(expressApp)
  const appFactory = await NestFactory.create(AppModule, expressAdapter)
  appFactory.enableCors({
    origin: '*',
    methods:'GET,HEAD,PUT,PATCH, POST, DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization'
  })
  await appFactory.init()
  return awsServerlessExpress.createServer(expressApp)

}

export const handler: Handler = async (event: any, context: Context) => {
  server = server || (await bootstrap())
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
}
