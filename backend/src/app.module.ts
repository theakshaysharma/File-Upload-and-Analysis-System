import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/user.entity";
import { Document } from "./models/document.entity";
import { BullModule } from "@nestjs/bull";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { FilesModule } from "./files/files.module";
import { UserModule } from "./user/user.module";
import { AdminModule } from "./admin/admin.module";
import { QueueModule } from "./queue/queue.module";
import { AppConfigService } from "./config/app-config.service";

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
    BullModule.forRootAsync({
      useFactory: async () => {
        
          return {
          redis: {
            host:'red-cthqv2t6l47c738aoub0',
            port: 6379,
          },
        };
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
