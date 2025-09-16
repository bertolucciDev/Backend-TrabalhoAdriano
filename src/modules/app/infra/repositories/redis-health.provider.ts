import { Injectable } from '@nestjs/common';
import { HealthRepository } from '../../domain/repositories/health.repository';
import { RedisService } from '@/shared/infra/cache/redis/redis.service';

@Injectable()
export class RedisHealthRepository implements HealthRepository {
  constructor(private readonly redis: RedisService) {}
  async checkConnection(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (err) {
      console.log(
        'cache connection error: ',
        err instanceof Error ? err.stack : String(err),
      );
    }
    return false;
  }
}
