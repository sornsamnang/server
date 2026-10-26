import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service.js";
import { S3ClientService } from "./s3-client/s3-client.service.js";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly S3Client: S3ClientService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':name.:ext')
  getImage(
    @Param("name") name: string,
    @Param("ext") ext: string,
  ){
    const key = name+"."+ext;

    if (!key.match(/\.(jpg|jpeg|png)$/)) {
      return "Only JPG and PNG images are allowed.";
    }

    return this.S3Client.getObject(key);
  }
}
