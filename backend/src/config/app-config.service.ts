import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type DatabaseConfig = {
  type: 'sqlite';
  database: string;
  synchronize: boolean;
};

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  // General App Configuration
  get appEnv(): string {
    return this.configService.get<string>('APP_ENV', 'development');
  }

  get httpPort(): number {
    return +this.configService.get<number>('APP_HTTP_PORT', 3000);
  }

  get httpsPort(): number {
    return +this.configService.get<number>('APP_HTTPS_PORT', 3443);
  }

  get isProduction(): boolean {
    return this.appEnv === 'production';
  }

  // Database Configuration
  get databaseConfig(): DatabaseConfig {
    return {
      type: 'sqlite',
      database: this.configService.get<string>('DB_PATH', './database.sqlite'),
      synchronize: this.configService.get<boolean>('DB_SYNCHRONIZE', true),
    };
  }
}


