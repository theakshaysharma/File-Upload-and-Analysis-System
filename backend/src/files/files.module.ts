import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './files.service';
import { FileController } from './files.controller';
import { Document } from 'src/models/document.entity';
import { User } from 'src/models/user.entity';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, User]), UserModule, JwtModule], // Import the TypeORM repository
  providers: [FileService, UserService, JwtService],
  controllers: [FileController],
})
export class FilesModule {}
