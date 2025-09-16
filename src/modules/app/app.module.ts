import { Module } from '@nestjs/common';

import { HealthRepository } from '@/modules/app/domain/repositories/health.repository';
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
      provide: HealthRepository,
      useClass: RedisHealthRepository,
    },
    {
      provide: HealthRepository,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class AppModule {}
