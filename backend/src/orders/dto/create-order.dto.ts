import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  pickupAddress!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(500)
  deliveryAddress!: string;

  @IsLatitude()
  pickupLatitude!: number;

  @IsLongitude()
  pickupLongitude!: number;

  @IsLatitude()
  deliveryLatitude!: number;

  @IsLongitude()
  deliveryLongitude!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
