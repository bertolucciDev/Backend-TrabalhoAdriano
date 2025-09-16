import { Injectable, Logger } from '@nestjs/common';
import { HealthRepository } from '../../domain/repositories/health.repository';
import { ResponseHealthDTO } from '../../presentation/dto/output/response-health.dto';
import { HealthStatus } from '@/shared/types/health-status.types';

@Injectable()
export class CheckHealthUseCase {
  private readonly logger = new Logger(CheckHealthUseCase.name);

  constructor(private readonly healthRepository: HealthRepository) {}

  async execute(): Promise<ResponseHealthDTO> {
    let dbStatus: HealthStatus = 'unhealthy';
    let cacheStatus: HealthStatus = 'unhealthy';

    try {
      if (await this.healthRepository.checkConnection()) {
        dbStatus = 'healthy';
      }
    } catch (err) {
      this.logger.error(
        `db connection failed: ${err.message}`,
        err instanceof Error ? err.stack : String(err),
      );
    }

    try {
      if (await this.healthRepository.checkConnection()) {
        cacheStatus = 'healthy';
      }
    } catch (err) {
      this.logger.error(
        `cache connection failed: ${err.message}`,
        err instanceof Error ? err.stack : String(err),
      );
    }

    const overallStatus: HealthStatus =
      dbStatus === 'healthy' && cacheStatus === 'healthy'
        ? 'healthy'
        : 'unhealthy';

    return {
      status: overallStatus,
      cache: cacheStatus,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      })
    }
  }
}
