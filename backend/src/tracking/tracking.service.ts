import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { TrackingGateway } from './tracking.gateway';

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trackingGateway: TrackingGateway,
  ) {}

  // =====================================
  // Update Rider Location
  // =====================================
  async updateLocation(riderId: string, latitude: number, longitude: number) {
    const rider = await this.prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    const trackingLocation = await this.prisma.trackingLocation.create({
      data: {
        riderId,
        latitude,
        longitude,
      },
    });

    this.trackingGateway.broadcastLocation({
      riderId,
      latitude,
      longitude,
      timestamp: trackingLocation.createdAt,
    });

    return {
      message: 'Location updated successfully',
      location: trackingLocation,
    };
  }

  // =====================================
  // Latest Rider Location
  // =====================================
  async getLatestLocation(riderId: string) {
    const rider = await this.prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    const latestLocation = await this.prisma.trackingLocation.findFirst({
      where: {
        riderId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!latestLocation) {
      throw new NotFoundException('No tracking data found');
    }

    return latestLocation;
  }

  // =====================================
  // Tracking History
  // =====================================
  async getTrackingHistory(riderId: string) {
    const rider = await this.prisma.rider.findUnique({
      where: {
        id: riderId,
      },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    return this.prisma.trackingLocation.findMany({
      where: {
        riderId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }

  // =====================================
  // Order Tracking
  // =====================================
  async getOrderTracking(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        rider: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.riderId) {
      throw new BadRequestException('Order has no rider assigned');
    }

    const latestLocation = await this.prisma.trackingLocation.findFirst({
      where: {
        riderId: order.riderId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      orderId: order.id,
      trackingCode: order.trackingCode,
      riderId: order.riderId,
      currentLocation: latestLocation,
      status: order.status,
    };
  }

  // =====================================
  // All Tracking Records
  // =====================================
  async findAll() {
    return this.prisma.trackingLocation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });
  }
}
