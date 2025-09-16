import { ClassConstructor } from 'class-transformer';
import { MetaInputVO } from '@/shared/domain/value-objects/meta-input.vo';
import { env } from '@/config/env';
import Redis from 'ioredis';

export abstract class CacheRepository<V = unknown> {
  protected ttl: number;

  constructor(
    protected client: Redis,
    protected name: string,
    protected classConstructor: new (...args: any[]) => V = Object as any,
    ttl?: number,
  ) {
    this.ttl = ttl || env.CACHE_TTL;
  }

  abstract set(key: string, value: V): Promise<void>;
  abstract setList(options: MetaInputVO<string>, value: V[]): Promise<void>;

  abstract get(key: string): Promise<V>;
  abstract getList(options: MetaInputVO<string>): Promise<V[]>;

  abstract del(key: string): Promise<void>;
  abstract delList(options: MetaInputVO<string>): Promise<void>;
}
