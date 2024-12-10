import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { FileService } from './files.service';
import { FileController } from './files.controller';
import { Document } from 'src/models/document.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // Use a secure key stored in `.env`
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Document]),
  ],
  providers: [FileService, JwtStrategy],
  controllers: [FileController],
})
export class FilesModule {}
