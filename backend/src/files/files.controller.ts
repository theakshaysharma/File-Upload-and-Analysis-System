import { Controller, Post, Get, UploadedFiles, Param, Query, ParseIntPipe } from '@nestjs/common';
import { FileService } from './files.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.fileService.uploadFiles(files);
  }

  @Get()
  async getFiles(@Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10) {
    return await this.fileService.getFiles(page, limit);
  }

  @Get(':id')
  async getFileDetails(@Param('id') id: number) {
    return await this.fileService.getFileDetails(id);
  }
}
