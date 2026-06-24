import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { UserRole } from '@prisma/client';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyNotifications(@Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.notificationsService.findMyNotifications(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  unreadCount(@Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.notificationsService.unreadCount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  markAllAsRead(@Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: AuthRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }
}
