import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [PrismaModule, NotificationsModule],

  controllers: [OrdersController],

  providers: [OrdersService],
})
export class OrdersModule {}
