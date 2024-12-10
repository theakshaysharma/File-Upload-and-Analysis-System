import {
  Controller,
  Post,
  Get,
  UploadedFiles,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFiles(
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Headers('authorization') authorizationHeader: string,
  ) {
    console.log('Authorization Header:', authorizationHeader); // Log the header to check if it's coming in the request

    if (!authorizationHeader) {
      console.error('Access token not found'); // Log if the header is missing
      throw new HttpException(
        'Access token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authorizationHeader.replace('Bearer ', '');
    console.log('Extracted Token:', token); // Log the extracted token

    try {
      const userId = this.fileService.verifyTokenAndExtractUserId(token);
      console.log('Extracted UserId:', userId); // Log the extracted userId

      if (!userId) {
        console.error('Invalid token or userId not found'); // Log invalid token scenario
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      console.log('Uploading files for userId:', userId); // Log the userId before file upload
      return await this.fileService.uploadFiles(files.files, userId);
    } catch (error) {
      console.error(
        'Error during token verification or file upload:',
        error.message,
      ); // Log any unexpected errors
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getFiles(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return await this.fileService.getFiles(page, limit);
  }

  @Get(':id')
  async getFileDetails(@Param('id') id: number) {
    return await this.fileService.getFileDetails(id);
  }
}
