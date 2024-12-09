import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus(): { status: string; uptime: number; timestamp: Date } {
    return {
      status: 'up and running',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }
}
