import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { FileService } from '../files/files.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../models/document.entity';
import { FileUploadProcessor } from './file-upload.processor/file-upload.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-upload',
      redis: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT,10) ?? 6379,
          },
    }),
    TypeOrmModule.forFeature([Document]),
  ],
  providers: [FileUploadProcessor, FileService],
})
export class QueueModule {}
