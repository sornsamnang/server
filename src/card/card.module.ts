import { Module } from '@nestjs/common';
import { CardService } from './card.service.js';
import { CardController } from './card.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3ClientService } from '../s3-client/s3-client.service.js';

@Module({
  controllers: [CardController],
  providers: [CardService, PrismaService, S3ClientService],
})
export class CardModule {}
