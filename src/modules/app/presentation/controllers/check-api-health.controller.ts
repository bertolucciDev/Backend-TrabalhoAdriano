import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';

@ApiTags('Health')
@Controller()
export class CheckApiHealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Check application health',
    description:
      'Returns the health status of the app and its dependencies (PostgreSQL and Cache).',
  })
  @ApiOkResponse({
    description: 'Application and dependencies are healthy',
  })
  @ApiServiceUnavailableResponse({
    description: 'One or more dependencies are down',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected internal error occurred',
    schema: {
      example: {
        status: 'unhealthy',
        database: 'unhealthy',
        cache: 'unhealthy',
        message: 'INTERNAL SERVER ERROR',
        timestamp: '16/09/2025 16:43:08',
      },
    },
  })
  async checkHealth() {
    try {
      const healthStatus = await this.checkHealthUseCase.execute();

      // Determina o status da aplicação baseado em database e cache
      const status = healthStatus.database === 'healthy' && healthStatus.cache === 'healthy'
        ? 'healthy'
        : 'unhealthy';

      if (status === 'unhealthy') {
        throw new HttpException({ ...healthStatus, status }, HttpStatus.SERVICE_UNAVAILABLE);
      }

      return { ...healthStatus, status };
    } catch (err) {
      const response = err instanceof HttpException && typeof err.getResponse() === 'object'
        ? (err.getResponse() as any)
        : {};

      const database = response.database ?? 'unhealthy';
      const cache = response.cache ?? 'unhealthy';
      const status = database === 'healthy' && cache === 'healthy' ? 'healthy' : 'unhealthy';

      throw new InternalServerErrorException({
        status,
        database,
        cache,
        message: 'INTERNAL SERVER ERROR',
        timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      });
    }
  }
}
