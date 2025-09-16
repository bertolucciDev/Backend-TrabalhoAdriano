import { Injectable } from '@nestjs/common';
import { DBHealthRepository } from '../../domain/repositories/db.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaHealthRepository implements DBHealthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async checkConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (err) {
      console.log(
        'db connection error: ',
        err instanceof Error ? err.stack : String(err),
      );
    }
    return false;
  }
}
