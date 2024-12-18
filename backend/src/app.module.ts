import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Document } from './models/document.entity';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { AppConfigService } from './config/app-config.service';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database.sqlite',
      entities: [User, Document],
      synchronize: true,
      logging: false,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    TypeOrmModule.forFeature([Document, User]),
    HealthModule,
    AuthModule,
    FilesModule,
    UserModule,
    AdminModule,
    QueueModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
