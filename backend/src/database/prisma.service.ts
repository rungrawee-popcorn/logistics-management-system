import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('Prisma connected successfully');
    } catch {
      console.warn('Prisma connection skipped (no database running yet)');
    }
  }
}
