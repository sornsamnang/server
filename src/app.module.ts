import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service.js';
import { CardModule } from './card/card.module.js';
import { S3ClientService } from './s3-client/s3-client.service.js';

@Module({
  imports: [
    // Makes the module available everywhere
    ConfigModule.forRoot({ isGlobal: true }),
    CardModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, S3ClientService],
})
export class AppModule { }