import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { RiderStatus, UserRole, Rider, User } from '@prisma/client';

import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';

@Injectable()
export class RidersService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE RIDER
  async create(createRiderDto: CreateRiderDto): Promise<{
    message: string;
    rider: Rider;
  }> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: createRiderDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.RIDER) {
      throw new BadRequestException('User is not a rider');
    }

    const rider: Rider = await this.prisma.rider.create({
      data: {
        userId: createRiderDto.userId,
        vehicleType: createRiderDto.vehicleType,
        licensePlate: createRiderDto.licensePlate,
        status: RiderStatus.AVAILABLE,
      },
    });

    return {
      message: 'Rider created successfully',
      rider,
    };
  }

  // GET ALL
  async findAll(): Promise<(Rider & { user: User })[]> {
    return this.prisma.rider.findMany({
      include: {
        user: true,
      },
    });
  }

  // GET ONE
  async findOne(id: string): Promise<Rider & { user: User; orders: any[] }> {
    const rider = await this.prisma.rider.findUnique({
      where: { id },
      include: {
        user: true,
        orders: true,
      },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    return rider;
  }

  // UPDATE
  async update(id: string, updateRiderDto: UpdateRiderDto): Promise<Rider> {
    const rider = await this.prisma.rider.findUnique({
      where: { id },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    return this.prisma.rider.update({
      where: { id },
      data: updateRiderDto,
    });
  }

  // DELETE
  async remove(id: string): Promise<Rider> {
    const rider = await this.prisma.rider.findUnique({
      where: { id },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    return this.prisma.rider.delete({
      where: { id },
    });
  }

  // AVAILABLE RIDERS
  async findAvailableRiders(): Promise<(Rider & { user: User })[]> {
    return this.prisma.rider.findMany({
      where: {
        status: RiderStatus.AVAILABLE,
      },
      include: {
        user: true,
      },
    });
  }

  // UPDATE STATUS
  async updateStatus(riderId: string, status: RiderStatus): Promise<Rider> {
    const rider = await this.prisma.rider.findUnique({
      where: { id: riderId },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    return this.prisma.rider.update({
      where: { id: riderId },
      data: { status },
    });
  }
}
