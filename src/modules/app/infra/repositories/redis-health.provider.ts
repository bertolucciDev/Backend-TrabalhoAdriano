import { Injectable } from '@nestjs/common';
import { CacheHealthRepository } from '../../domain/repositories/redis.repository';
import { RedisService } from '@/shared/infra/cache/redis/redis.service';

@Injectable()
export class RedisHealthRepository implements CacheHealthRepository {
  constructor(private readonly redis: RedisService) {}
  async checkConnection(): Promise<boolean> {
    try {
      const result = await this.redis.ping();

      return result === 'PONG';
    } catch (err) {
      console.log(
        'cache connection error: ',
        err instanceof Error ? err.stack : String(err),
      );
    }
    return false;
  }
}
