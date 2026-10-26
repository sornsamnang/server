import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3ClientService } from '../s3-client/s3-client.service.js';

@Injectable()
export class CardService {

  constructor(
    public readonly prisma: PrismaService,
    public readonly S3Client: S3ClientService
  ){}

  async create(
    createCardDto: CreateCardDto,
    files: Array<Express.Multer.File>
  ) {
    const card = await this.prisma.card.create({
      data: {
        title: createCardDto.title,
        description: createCardDto.description,
        images: {
          create: await Promise.all(files.map(async (file) => {          
            const response = await this.S3Client.upload(file);

            return {
              key: response.Key,
              url: response.Location
            }
          }))
        }
      }
    });

    return card;
  }

  findAll() {
    const cards = this.prisma.card.findMany({
      include: {
        images: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return cards;
  }

  findOne(id: number) {
    const card = this.prisma.card.findUniqueOrThrow({
      include: {
        images: true
      },
      where: {
        id
      }
    });

    return card;
  }

  async update(
    id: number,
    updateCardDto: UpdateCardDto,
    files?: Array<Express.Multer.File> | null
  ) {

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. delete old images
      const imagesId = updateCardDto.imagesId?.split(",")?.map(id => Number(id));
      await tx.image.deleteMany({
        where: {
          cardId: id,
          id: {
            notIn: imagesId
          }
        }
      });

      // 2. find old images
      const oldImages = await tx.image.findMany({
        where: {
          cardId: id
        },
        select: {
          id: true,
          key: true,
          url: true
        }
      });
      
      // 3. add new images
      var newImages: any = [];

      if(files){// file has or not
        newImages = await Promise.all(files.map(async (file) => {
          const result = await this.S3Client.upload(file);
          
          return {
            key: result.Key,
            url: result.Location
          }
        }));
      }
      
       // 4. update card
      const card = await tx.card.update({
        include: {
          images: true
        },
        where: {
          id
        },
        data: {
          title: updateCardDto.title,
          description: updateCardDto.description,
          images: {
            set: oldImages,
            create: newImages
          }
        }
      });
      
      return card;
    });

    return result;
  }

  remove(id: number) {
    const card = this.prisma.card.delete({
      where: {id}
    });

    return card;
  }
}