import {
  Controller,
  Post,
  Get,
  UploadedFiles,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFiles(@UploadedFiles() files: { files: Express.Multer.File[] }) {
    return await this.fileService.uploadFiles(files.files);
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
