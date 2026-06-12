import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AssignRiderDto } from './dto/assign-rider.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // =========================
  // Create order
  // =========================
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CUSTOMER)
  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateOrderDto) {
    if (!req.user) throw new UnauthorizedException();
    return this.ordersService.create(req.user.userId, dto);
  }

  // =========================
  // Get all orders
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: AuthRequest) {
    if (!req.user) throw new UnauthorizedException();
    return this.ordersService.findAll(req.user.userId, req.user.role);
  }

  // =========================
  // Get single order
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    if (!req.user) throw new UnauthorizedException();
    return this.ordersService.findOne(id, req.user.userId, req.user.role);
  }

  // =========================
  // Update order
  // =========================
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  // =========================
  // Delete order
  // =========================
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  // =========================
  // Assign rider
  // =========================
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/assign-rider')
  assignRider(
    @Param('id') orderId: string,
    @Req() req: AuthRequest,
    @Body() dto: AssignRiderDto,
  ) {
    if (!req.user) throw new UnauthorizedException();

    return this.ordersService.assignRider(
      orderId,
      dto.riderId,
      req.user.userId,
    );
  }
}
