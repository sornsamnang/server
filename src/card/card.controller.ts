import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipeBuilder } from '@nestjs/common';
import { CardService } from './card.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/card')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  create(
    @Body() createCardDto: CreateCardDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.cardService.create(createCardDto, files);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor("files"))
  update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType:'jpeg|png'})
      .build({
        fileIsRequired: false, // 👈 file nullable
      }),
    ) files?: Array<Express.Multer.File> | null
  ) {
    return this.cardService.update(+id, updateCardDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
