import { Injectable, StreamableFile } from "@nestjs/common";
import { Upload } from "@aws-sdk/lib-storage";
import { 
  CompleteMultipartUploadCommandOutput, 
  GetObjectCommand, 
  S3Client 
} from "@aws-sdk/client-s3";

@Injectable()
export class S3ClientService {
  
  private readonly s3Client: S3Client;

  constructor(){
    this.s3Client = new S3Client({
      // • Europe (Frankfurt): "eu-central-1"
      // • US East (N. Virginia): "us-east-1"
      // • Asia Pacific (Mumbai): "ap-south-1"
      // • Asia Pacific (Tokyo): "ap-northeast-1"
      // • Asia Pacific (Singapore): "ap-southeast-1"
      region: "ap-southeast-1",
      endpoint: process.env["S3_ENDPOINT"],
      credentials: {
        accessKeyId: process.env["S3_ACCESS_KEY_ID"]!,   // s3_token_id
        secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"]!, // s3_secret_access_key
      },
      forcePathStyle: true,
    });
  }

  // function for file upload
  public upload = async (
    file: Express.Multer.File
  ): Promise<CompleteMultipartUploadCommandOutput> => {   
    const client = this.s3Client;

    const upload = new Upload({
      client,
      params: {
        Bucket: process.env["S3_BUCKET"],
        Key: file.originalname,
        Body: file.buffer,
      },
      partSize: 10 * 1024 * 1024, // 10 MiB per part
    });
  
    const response = await upload.done();
    return response;
  }

  // function for get file form s3
  public getObject = async (key: string) => {
    const command = new GetObjectCommand({
      Bucket: process.env["S3_BUCKET"],
      Key: key
    });

    const response = await this.s3Client.send(command);
    const fileContentsString = await response.Body!.transformToByteArray();

    return new StreamableFile(fileContentsString, {
      type: "image/png",
      disposition: `inline; filename="${key}"`,
    });
  }
}