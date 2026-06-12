import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateRiderDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  vehicleType!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  licensePlate!: string;
}
