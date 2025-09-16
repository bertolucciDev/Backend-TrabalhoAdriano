import { Injectable, Logger } from '@nestjs/common';
import { DBHealthRepository } from '../../domain/repositories/db.repository';
import { CacheHealthRepository } from '../../domain/repositories/redis.repository';
import { ResponseHealthDTO } from '../../presentation/dto/output/response-health.dto';
import { HealthStatus } from '@/shared/types/health-status.types';

@Injectable()
export class CheckHealthUseCase {
  private readonly logger = new Logger(CheckHealthUseCase.name);

  constructor(
    private readonly dbHealthRepository: DBHealthRepository,
    private readonly cacheHealthRepository: CacheHealthRepository,
  ) {}

  async execute(): Promise<ResponseHealthDTO> {
    let dbStatus: HealthStatus = 'unhealthy';
    let cacheStatus: HealthStatus = 'unhealthy';

    // Banco de dados
    try {
      if (await this.dbHealthRepository.checkConnection()) {
        dbStatus = 'healthy';
      }
    } catch (err) {
      this.logger.error(
        `db connection failed: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
    }

    // Cache
    try {
      if (await this.cacheHealthRepository.checkConnection()) {
        cacheStatus = 'healthy';
      }
    } catch (err) {
      this.logger.error(
        `cache connection failed: ${err instanceof Error ? err.message : String(err)}`,
        err instanceof Error ? err.stack : undefined,
      );
    }

    // const overallStatus: HealthStatus =
    //   dbStatus === 'healthy' && cacheStatus === 'healthy'
    //     ? 'healthy'
    //     : 'unhealthy';

    return {
      status: 'healthy',
      cache: cacheStatus,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    };
  }
}
