import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { OrderStatus, RiderStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // CONFIG (Delivery Fee Rules)
  // =========================
  private readonly BASE_FEE = 20;
  private readonly PRICE_PER_KM = 5;

  // =========================
  // Utility: Calculate Distance (Haversine Formula)
  // =========================
  private calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // =========================
  // Create a new order
  // =========================
  async create(customerId: string, createOrderDto: CreateOrderDto) {
    const trackingCode = `TRK-${Date.now()}`;

    // Calculate distance
    const distanceKm = this.calculateDistanceKm(
      createOrderDto.pickupLatitude,
      createOrderDto.pickupLongitude,
      createOrderDto.deliveryLatitude,
      createOrderDto.deliveryLongitude,
    );

    // Calculate delivery fee
    const deliveryFee = this.BASE_FEE + distanceKm * this.PRICE_PER_KM;

    const totalPrice = deliveryFee;

    const order = await this.prisma.order.create({
      data: {
        trackingCode,
        customerId,

        pickupAddress: createOrderDto.pickupAddress,
        deliveryAddress: createOrderDto.deliveryAddress,

        pickupLatitude: createOrderDto.pickupLatitude,
        pickupLongitude: createOrderDto.pickupLongitude,

        deliveryLatitude: createOrderDto.deliveryLatitude,
        deliveryLongitude: createOrderDto.deliveryLongitude,

        distanceKm,
        deliveryFee,
        totalPrice,

        note: createOrderDto.note ?? null,
      },
    });

    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        updatedBy: customerId,
        status: OrderStatus.PENDING,
      },
    });

    return {
      message: 'Order created successfully',
      order,
    };
  }

  // =========================
  // Get all orders (role-based access)
  // =========================
  async findAll(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === UserRole.CUSTOMER) {
      return this.prisma.order.findMany({
        where: { customerId: userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === UserRole.RIDER) {
      return this.prisma.order.findMany({
        where: { riderId: userId },
        orderBy: { createdAt: 'desc' },
      });
    }

    return [];
  }

  // =========================
  // Get single order (secure access control)
  // =========================
  async findOne(orderId: string, userId: string, role: UserRole) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        rider: true,
        payment: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === UserRole.ADMIN) return order;

    if (role === UserRole.CUSTOMER && order.customerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (role === UserRole.RIDER && order.riderId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  // =========================
  // Update order
  // =========================
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  // =========================
  // Delete order
  // =========================
  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }

  // =========================
  // Atomic status update
  // =========================
  async updateStatus(orderId: string, userId: string, status: OrderStatus) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CANCELLED
      ) {
        throw new BadRequestException('Order cannot be updated');
      }

      const validFlow: Record<OrderStatus, OrderStatus[]> = {
        PENDING: [OrderStatus.ASSIGNED],
        ASSIGNED: [OrderStatus.PICKED_UP],
        PICKED_UP: [OrderStatus.IN_TRANSIT],
        IN_TRANSIT: [OrderStatus.DELIVERED],
        DELIVERED: [],
        CANCELLED: [],
      };

      const allowedNext = validFlow[order.status];

      if (!allowedNext.includes(status)) {
        throw new BadRequestException(
          `Invalid transition: ${order.status} -> ${status}`,
        );
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          updatedBy: userId,
          status,
        },
      });

      return updated;
    });
  }

  // =========================
  // Atomic assign rider
  // =========================
  async assignRider(orderId: string, riderId: string, adminUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.riderId) {
        throw new BadRequestException('Order already assigned');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be assigned');
      }

      const rider = await tx.rider.findUnique({
        where: { id: riderId },
      });

      if (!rider) {
        throw new NotFoundException('Rider not found');
      }

      if (rider.status !== RiderStatus.AVAILABLE) {
        throw new BadRequestException('Rider not available');
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          riderId,
          status: OrderStatus.ASSIGNED,
        },
      });

      await tx.rider.update({
        where: { id: riderId },
        data: {
          status: RiderStatus.BUSY,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          updatedBy: adminUserId,
          status: OrderStatus.ASSIGNED,
        },
      });

      return {
        message: 'Rider assigned successfully',
        order: updatedOrder,
      };
    });
  }
}
