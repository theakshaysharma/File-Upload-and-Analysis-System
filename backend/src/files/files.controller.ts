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
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { multerOptions } from 'src/config/multer.config';

@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], multerOptions)) // Pass custom multerOptions here
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

 @Get('/all')
async getFiles(@Req() req: any, @Query() query: any) {
  const userId = req.user.id; // Extract userId from the request object

  // Deconstruct query parameters with defaults
  const { page , limit , fileName, fileType } = query;

  const { data, total } = await this.fileService.getFiles({
    userId,
    page: Number(page),
    limit: Number(limit),
    fileName,
    fileType,
  });

  return {
    status:"success",
    data:{
      documents: data.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      status: file.status,
      createdAt: file.createdAt,
    })),
    total,}
  };
}



  @Get(':id')
  async getFileDetails(@Param('id', ParseIntPipe) id: number) {
    const file = await this.fileService.getFileDetails(id);
    if (!file) {
      return { message: 'File not found' }; // Handle not found case
    }
    return {
      status: "success",
      data: {
        id: file.id,
        fileName: file.fileName,
        fileType: file.fileType,
        filePath: file.filePath,
        status: file.status,
        extractedData: file.extractedData, // Include extracted data
        createdAt: file.createdAt,
      },
    };
  }



  @Delete(':id')
async deleteFile(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
  try {
    const userId = req.user.id; // Ensure the user has access to delete the file
    const result = await this.fileService.deleteFile(id, userId);
    return {
      status: 'success',
      message: result ? 'File deleted successfully' : 'File not found or unauthorized',
    };
  } catch (error) {
    throw error;
  }
}
}
