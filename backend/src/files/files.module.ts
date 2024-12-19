import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { FileService } from './files.service';
import { FileController } from './files.controller';
import { Document } from 'src/models/document.entity';
import { QueueModule } from 'src/queue/queue.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PassportModule,
    QueueModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Document]),
    BullModule.registerQueue({
      name: 'file-upload',
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) ?? 6379,
      },
    }),
  ],
  providers: [FileService, JwtStrategy],
  controllers: [FileController],
})
export class FilesModule {}
