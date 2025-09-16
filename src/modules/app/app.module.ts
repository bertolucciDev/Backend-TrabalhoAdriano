import { Module } from '@nestjs/common';

import { CacheHealthRepository } from '@/modules/app/domain/repositories/redis.repository';
import { DBHealthRepository } from '@/modules/app/domain/repositories/db.repository';
import { RedisHealthRepository } from '@/modules/app/infra/repositories/redis-health.provider';
import { PrismaHealthRepository } from '@/modules/app/infra/repositories/prisma-health.provider';
import { SharedModule } from '@/shared/shared.module';

import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';
import { CheckApiHealthController } from '@/modules/app/presentation/controllers/check-api-health.controller';

@Module({
  imports: [SharedModule],
  controllers: [CheckApiHealthController],
  providers: [
    CheckHealthUseCase,
    {
      provide: CacheHealthRepository,
      useClass: RedisHealthRepository,
    },
    {
      provide: DBHealthRepository,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class AppModule {}
