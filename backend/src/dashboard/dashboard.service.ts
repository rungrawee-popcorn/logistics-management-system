import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalUsers,
      totalRiders,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      unreadNotifications,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.rider.count(),

      this.prisma.order.count(),

      this.prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.order.count({
        where: {
          status: 'DELIVERED',
        },
      }),

      this.prisma.notification.count({
        where: {
          isRead: false,
        },
      }),
    ]);

    return {
      totalUsers,
      totalRiders,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      unreadNotifications,
    };
  }
}
