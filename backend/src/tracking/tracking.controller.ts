import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { TrackingService } from './tracking.service';

import { UpdateLocationDto } from './dto/update-location.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // =====================================
  // Update Rider Location
  // =====================================
  @UseGuards(JwtAuthGuard)
  @Post('rider/:riderId/location')
  updateLocation(
    @Param('riderId') riderId: string,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.trackingService.updateLocation(
      riderId,
      dto.latitude,
      dto.longitude,
    );
  }

  // =====================================
  // Latest Rider Location
  // =====================================
  @UseGuards(JwtAuthGuard)
  @Get('rider/:riderId/latest')
  getLatestLocation(@Param('riderId') riderId: string) {
    return this.trackingService.getLatestLocation(riderId);
  }

  // =====================================
  // Rider Tracking History
  // =====================================
  @UseGuards(JwtAuthGuard)
  @Get('rider/:riderId/history')
  getTrackingHistory(@Param('riderId') riderId: string) {
    return this.trackingService.getTrackingHistory(riderId);
  }

  // =====================================
  // Track Order
  // =====================================
  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  getOrderTracking(@Param('orderId') orderId: string) {
    return this.trackingService.getOrderTracking(orderId);
  }

  // =====================================
  // Admin View Tracking Records
  // =====================================
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.trackingService.findAll();
  }
}
