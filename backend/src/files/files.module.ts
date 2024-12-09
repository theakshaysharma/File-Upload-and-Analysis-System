import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './files.service';
import { FileController } from './files.controller';
import { Document } from 'src/models/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])], // Import the TypeORM repository
  providers: [FileService],
  controllers: [FileController]
})
export class FilesModule {}
