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
    TypeOrmModule.forFeature([Document, User]),
    HealthModule,
    AuthModule,
    FilesModule,
    UserModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
