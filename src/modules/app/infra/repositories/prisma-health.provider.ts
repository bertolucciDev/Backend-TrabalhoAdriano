import { Injectable } from "@nestjs/common";
import { HealthRepository } from "../../domain/repositories/health.repository";
import { PrismaService } from "@/shared/infra/database/prisma/prisma.service";

@Injectable()
export class PrismaHealthRepository implements HealthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async checkConnection(): Promise<boolean> {
      try{
        await this.prisma.$queryRaw`SELECT 1`;
        return true;
      }catch (err) {
        console.log('db connection error: ', err instanceof Error ? err.stack : String(err))
      }
      return false;
  }
}
