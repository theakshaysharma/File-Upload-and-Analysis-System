import {
  Controller,
  Post,
  Get,
  UploadedFiles,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';
import { JwtAuthGuard } from 'src/guards/jwt.guards';

@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFiles(
    @UploadedFiles() files: { files: Express.Multer.File[] },
    @Req() req: any, // `req.user` is populated by the guard
  ) {
    try {
      const userId = req.user.id; // Extract user ID from `req.user`
      const uploadResult = await this.fileService.uploadFiles(
        files.files,
        userId,
      );

      return {
        status: 'success',
        data: uploadResult,
      };
    } catch (error) {
      throw error; // Re-throw the error to be handled globally
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
